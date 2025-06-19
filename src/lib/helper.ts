import { fromWei } from "./formater";

export type Pool = {
   apy: bigint;
   currentPoolSize: bigint;
   emergencyFees: bigint;
   maxContribution: bigint;
   maxPoolSize: bigint;
   minContribution: bigint;
   minLockDays: bigint;
   poolActive: boolean;
   poolType: boolean;
   totalETHRewardsClaimed: bigint;
   totalRewardsClaimed: bigint;
   totalTokenRewards: bigint;
   totalETHRewards: bigint;
};


export const defaultPool = {
   apy: 0,
   poolType: true,
   poolActive: true,
   currentPoolSize: "0",
   emergencyFees: 0,
   maxContribution: "0",
   maxPoolSize: "0",
   minContribution: "0",
   minLockDays: 0,
   totalETHRewardsClaimed: "0",
   totalRewardsClaimed: "0",
   totalTokenRewards: "0",
   totalETHRewards: "0",
};

export const defaultUser = {
   amount: "0",
   stakingTime: 0,
   rewardClaimed: "0",
   rewardETHClaimed: "0",
   totalETHRewardsClaimed: "0",
   totalTokenRewardsClaimed: "0",
};


export function poolFormatter(pool: Pool) {
   if (!pool)
      return {
         apy: 0,
         currentPoolSize: "0",
         emergencyFees: 0,
         maxContribution: "0",
         maxPoolSize: "0",
         minContribution: "0",
         minLockDays: 0,
         poolActive: false,
         poolType: false,
         totalETHRewardsClaimed: "0",
         totalRewardsClaimed: "0",
         totalTokenRewards: "0",
         totalETHRewards: "0",
      };

   return {
      apy: Number(pool.apy),
      poolType: pool.poolType,
      poolActive: pool.poolActive,
      currentPoolSize: fromWei(pool.currentPoolSize),
      emergencyFees: Number(pool.emergencyFees),
      maxContribution: fromWei(pool.maxContribution),
      maxPoolSize: fromWei(pool.maxPoolSize),
      minContribution: fromWei(pool.minContribution),
      minLockDays: Number(pool.minLockDays),
      totalETHRewardsClaimed: fromWei(pool.totalETHRewardsClaimed, 18),
      totalRewardsClaimed: fromWei(pool.totalRewardsClaimed),
      totalTokenRewards: fromWei(pool.totalTokenRewards),
      totalETHRewards: fromWei(pool.totalETHRewards, 18),
   };
}

export type UserStake = {
   amount: bigint;
   stakingTime: bigint;
   rewardClaimed: bigint;
   rewardETHClaimed: bigint;
   totalETHRewardsClaimed: bigint;
   totalTokenRewardsClaimed: bigint;
};

export function userFormatter(user: UserStake) {
   if (!user)
      return {
         amount: "0",
         rewardClaimed: "0",
         rewardETHClaimed: "0",
         stakingTime: 0,
         totalETHRewardsClaimed: "0",
         totalTokenRewardsClaimed: "0",
      };

   return {
      amount: fromWei(user.amount),
      rewardClaimed: fromWei(user.rewardClaimed),
      rewardETHClaimed: fromWei(user.rewardETHClaimed, 18),
      stakingTime: Number(user.stakingTime),
      totalETHRewardsClaimed: user.totalETHRewardsClaimed,
      totalTokenRewardsClaimed: user.totalTokenRewardsClaimed,
   };
}
