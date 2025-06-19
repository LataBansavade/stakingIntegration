import { useState, useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { open } = useAppKit();

  const handleWalletConnect = () => {
    open();
    if(isConnected){
      setIsWalletConnected(true);
      setWalletAddress(address || "");
    }
  };

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
      setIsWalletConnected(true);
    } else {
      setWalletAddress("");
      setIsWalletConnected(false);
    }
  }, [address]);

  // Format wallet address for display
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    if (addr.length <= 10) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className="flex justify-between items-center p-4 px-20 text-white bg-gray-900">
      <div className="text-xl font-bold">Staking</div>
      <div>
        <button
          onClick={handleWalletConnect}
          className="px-4 py-2 bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
        >
          {isWalletConnected ? (
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {formatAddress(walletAddress)}
            </div>
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;