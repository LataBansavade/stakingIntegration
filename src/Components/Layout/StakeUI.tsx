import { useAccount } from "wagmi";
import useNetworkData from "../../blockchain/hooks/useNetworkData";
import { useContract } from "../../provider/contractContext";
import { useCallback, useEffect, useState } from "react";
import {
  defaultPool,
  defaultUser,
  poolFormatter,
  userFormatter,
  type Pool,
  type UserStake,
} from "../../lib/helper";
import useConfirmationToast from "../../blockchain/hooks/useConfirmationToast";
import {
  formatNumber,
  formatUnixTimestamp,
  fromWei,
  toWei,
} from "../../lib/formater";
import { toast } from "sonner";
import { getValueInUSD, sendAndConfirmTransaction } from "../../lib/crypto";
import { findError } from "../../lib/handleError";

const StakeUI = () => {
  const { address, isConnected } = useAccount();
  const network = useNetworkData();
  const { contract, token } = useContract();

  const [inputValue, setInputValue] = useState("");
  const [pool, setPoolInfo] = useState(defaultPool);
  const [claimableETHAmount, setClaimableETHAmount] = useState(0);
  const [userInfo, setUserStakeInfo] = useState(defaultUser);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [userBal, setUserBal] = useState(0);
  const [_, setLoading] = useState(false);
  const [totalTokenStakedInPoolValue, setTotalTokenStakedInPoolValue] =
    useState<number | undefined>(0);
  const confirmationToastStake = useConfirmationToast("stake");
  const [unlockAfter, setUnlockAfter] = useState(0);

  //--------------------------------------------------------------------------------------------------------------------
  // function to handle input from user for staking amount
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only positive whole numbers (no decimals, no negatives)
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  
  // -----------------------------------------------------------------------------------------------------------------
  const getPool = async () => {
    try {
      const pool: Pool = await contract.pool();
      const format = poolFormatter(pool);
      setPoolInfo(format);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const getUser = async () => {
    if (!address) return;
    try {
      const [
        userStakeInfo,
        totalTokenRewardsClaimed,
        totalETHRewardsClaimed,
        unlockAfter,
      ]: [UserStake, bigint, bigint, bigint] = await Promise.all([
        contract.userInfo(address),
        contract.tokenRewardsClaimed(address),
        contract.ethRewardsClaimed(address),
        contract.unlockAfter(address),
      ]);
      const format = userFormatter(userStakeInfo);
      setUserStakeInfo({
        ...format,
        totalTokenRewardsClaimed: fromWei(totalTokenRewardsClaimed),
        totalETHRewardsClaimed: fromWei(totalETHRewardsClaimed, 18),
      });
      setUnlockAfter(Number(unlockAfter));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    getUser();
  }, [contract]);

  const fetchData = async () => {
    if (!address) return;
    try {
      const claimableAmount: bigint = await contract.claimableRewards(address);
      const claimableETHAmount: bigint = await contract.claimableETHReward(
        address
      );
      const userBal: bigint = await token.balanceOf(address);
      setClaimableAmount(+fromWei(claimableAmount));
      setClaimableETHAmount(+fromWei(claimableETHAmount, 18));
      setUserBal(+fromWei(userBal));
    } catch (error) {
      console.log("error: ", error);
    }
  };
  // --------------------------------------------------------------------------------------------------------------------

  // approve function to approve before staking
  async function approve(amount: bigint) {
    const allowance: bigint = await token.allowance(address, network.contract);
    if (allowance > amount) return true;

    return new Promise((resolve, reject) => {
      toast.promise(
        sendAndConfirmTransaction(() =>
          token.approve(network.contract, toWei(1000000000))
        ),
        {
          loading: "Approving...",
          success: () => {
            resolve(true);
            return "Approved";
          },
          error: (e) => {
            reject(findError(e, "Approval failed"));
            return findError(e, "Approval failed");
          },
        }
      );
    });
  }

  // always validte user balance
  async function validateBalance() {
    const balance: bigint = await token.balanceOf(address);
    if (+fromWei(balance) < +pool.minContribution) {
      toast.error("Insufficient balance");
      throw new Error("Insufficient balance");
    }
    return true;
  }

  // staking ------------------------------------------------------------------------------------------------------
  async function stake() {
    await validateBalance();
    if (!inputValue) return toast.error("Enter Stake Amount");
    const _amount = toWei(inputValue);
    const isApproved = await approve(_amount);
    if (!isApproved) return;

    return new Promise((resolve, reject) => {
      const tx = sendAndConfirmTransaction(() => contract.stakeTokens(_amount));
      toast.promise(tx, {
        loading: "Staking...",
        success: async function () {
          setInputValue("");
          await refetchData();
          resolve("Staked Successfully");
          return "Staked Successfully";
        },
        error: (e) => {
          const errorMsg = findError(e, "Stake failed");
          reject(errorMsg);
          return errorMsg;
        },
      });
    });
  }

  async function handleStake() {
    try {
      if (!isConnected) {
        return toast.error("Please connect your wallet");
      }

      if (+inputValue < +pool.minContribution) {
        return toast.error(
          `Minimum stake amount is ${pool.minContribution} $AXOMAI`
        );
      }

      setLoading(true);
      if (claimableETHAmount > 0) {
        return confirmationToastStake(stake);
      }
      await stake();
    } finally {
      setLoading(false);
    }
  }

  //------------------------------------------------------------------------------------------------------------------
  // emergency widthdraw
  async function handleEmergencyWithdraw() {
    try {
      setLoading(true);
      await new Promise((resolve, reject) => {
        toast.promise(
          sendAndConfirmTransaction(() => contract.emergencyWithdraw()),
          {
            loading: "Withdrawing...",
            success: async () => {
              await refetchData();
              resolve("Withdrawn Successfully");
              return "Withdrawn Successfully";
            },
            error: (e) => {
              const errorMsg = findError(e, "Emergency withdraw failed");
              reject(errorMsg);
              return errorMsg;
            },
          }
        );
      });
    } finally {
      setLoading(false);
    }
  }

  //------------------------------------------------------------------------------------------------------------------------------

  // unstaking
  async function handleUnstake() {
    try {
      setLoading(true);
      await new Promise((resolve, reject) => {
        toast.promise(
          sendAndConfirmTransaction(() => contract.unstakeTokens()),
          {
            loading: "Unstaking...",
            success: async () => {
              await refetchData();
              resolve("Tokens UnStaked Successfully");
              return "Tokens UnStaked Successfully";
            },
            error: (e) => {
              const errorMsg = findError(e, "UnStake failed");
              reject(errorMsg);
              return errorMsg;
            },
          }
        );
      });
    } finally {
      setLoading(false);
    }
  }

  //----------------------------------------------------------------------------------------------------------------------

  async function handleEthClaimRewards() {
    await new Promise((resolve, reject) => {
      toast.promise(
        sendAndConfirmTransaction(() => contract.claimETHReward()),
        {
          loading: "Claiming...",
          success: async () => {
            await fetchData();
            resolve("Claimed Successfully");
            return "Claimed Successfully";
          },
          error: (e) => {
            const errorMsg = findError(e, "Claim failed");
            reject(errorMsg);
            return errorMsg;
          },
        }
      );
    });
  }

  //---------------------------------------------------------------------------------------------------------------------

  const publicData = async () => {
    await getPool();
  };

  const totalStakedTokenValue = async () => {
    try {
      const totalTokenValue = await getValueInUSD(+pool?.currentPoolSize);
      console.log("Returned totalTokenValue:", totalTokenValue);
      setTotalTokenStakedInPoolValue(totalTokenValue);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const fetchAmount = useCallback(async () => {
    try {
      if (+pool.currentPoolSize > 0) {
        await totalStakedTokenValue();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, [pool, userInfo]);

  const refetchData = async () => {
    await publicData();
    await getUser();
    await fetchData();
    await fetchAmount();
  };

  useEffect(() => {
    publicData();
    refetchData();
  }, [contract, pool?.currentPoolSize, address]);

  // console.log("pool data is ", pool)

  return (
    <div className="p-4 min-h-screen text-white bg-black md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-center md:text-4xl md:mb-12">
          Stake <span className="text-purple-500">$AXOMAI</span> and Earn
          Rewards
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Staking Summary */}

          <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 lg:col-span-2 xl:col-span-3">
            <h2 className="mb-6 text-xl font-bold">Staking Summary</h2>
            <div className="my-6 text-sm text-right text-gray-400">
              Total Claimed:{" "}
              <span className="text-purple-400">
                {Number(pool?.totalETHRewardsClaimed)?.toFixed(3)} ETH
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="mb-2 text-sm text-gray-400">
                  Total Value Locked
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  ${totalTokenStakedInPoolValue?.toFixed(2)}
                </div>
                <div className="text-sm text-gray-300">
                  {formatNumber(pool?.currentPoolSize)}
                  <span className="text-xl"> $AXOMAI</span>
                </div>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="mb-2 text-sm text-gray-400">Your Staked</div>
                <div className="text-2xl font-bold">
                  {formatNumber(userInfo?.amount)} $AXOMAI
                </div>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="mb-2 text-sm text-gray-400">APY</div>
                <div className="text-2xl font-bold text-green-400">
                  {pool.apy}%
                </div>
                <div className="text-sm text-gray-300">
                  Annual Percentage Yield
                </div>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="mb-2 text-sm text-gray-400">Your Rewards</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {claimableAmount} $AXOMAI
                </div>
                <div className="text-sm text-gray-300">
                  {claimableETHAmount > 0 && (
                    <span>{claimableETHAmount} ETH</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400">Lock Period</div>
                  <div className="font-medium">{pool.minLockDays} Days</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Locked Until</div>
                  <div className="text-right">
                    {userInfo?.stakingTime == 0
                      ? "NA"
                      : formatUnixTimestamp(userInfo?.stakingTime)}
                  </div>
                </div>
              </div>

              <button
                onClick={handleEthClaimRewards}
                disabled={claimableETHAmount <= 0}
                className={`w-full py-4 rounded-xl font-bold text-lg ${
                  claimableETHAmount > 0
                    ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                } transition-colors`}
              >
                {"CLAIM REWARDS"}
              </button>
            </div>
          </div>
        </div>

        {/* staking/unstaking Panel */}

        <div className="p-6 bg-gray-800 rounded-lg shadow-lg my-[3rem]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Stake Section */}
            <div className="p-5 bg-gray-700 rounded-lg">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Stake Tokens
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="stake-amount"
                    className="block mb-1 text-sm font-medium text-gray-300"
                  >
                    Amount to Stake
                  </label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      id="stake-amount"
                      value={inputValue}
                      onChange={handleChange}
                      className="block flex-1 px-3 py-2 w-full min-w-0 placeholder-gray-400 text-white bg-gray-600 rounded-l-md border-0 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter amount"
                    />

                    <button
                      className={`px-2 py-1 text-xs border cursor-pointer border-white/20 text-white/20`}
                      onClick={() =>
                        setInputValue(pool?.maxContribution || "0")
                      }
                    >
                      MAX
                    </button>
                    <button
                      className={`px-2 py-1 text-xs border cursor-pointer border-white/20 text-white/20`}
                      onClick={() =>
                        setInputValue(pool?.minContribution || "0")
                      }
                    >
                      MIN
                    </button>
                    <button
                      onClick={handleStake}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-r-md border border-transparent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Stake
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Balance: {userBal} tokens
                  </p>
                </div>
              </div>
            </div>

            {/* Withdraw Section */}
            <div className="p-5 bg-gray-700 rounded-lg">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Withdraw
              </h3>
              <div className="space-y-4">
                <div>
                  <button
                    onClick={handleUnstake}
                    className="flex justify-center px-4 py-2 w-full text-sm font-medium text-white bg-green-600 rounded-md border border-transparent shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Unstake Tokens
                  </button>
                  <div className="pt-4 mt-4 border-t border-gray-600">
                    <h4 className="mb-2 text-sm font-medium text-red-400">
                      Emergency Withdraw
                    </h4>
                    <p className="mb-3 text-xs text-gray-400">
                      Early withdrawal fee:{" "}
                      <span className="font-semibold">
                        {pool?.emergencyFees / 10}%
                      </span>
                    </p>
                    <button
                      onClick={handleEmergencyWithdraw}
                      className="flex justify-center px-4 py-2 w-full text-sm font-medium text-white bg-red-600 rounded-md border border-transparent shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Emergency Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeUI;
