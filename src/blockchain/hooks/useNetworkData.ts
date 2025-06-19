import { useChainId } from "wagmi";
import { getNetwork, type ChainId } from "../networks/network";
import React from "react";

const useNetworkData = () => {
   const chainId = useChainId();

   const { contract, token, explorerUrl } = getNetwork(chainId as ChainId);
   return React.useMemo(() => ({ contract, token, explorerUrl }), [chainId, contract, token, explorerUrl]);
};

export default useNetworkData;