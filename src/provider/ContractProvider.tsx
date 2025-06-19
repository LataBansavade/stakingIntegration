import { Contract } from "ethers";
import { useMemo } from "react";
import {
    useEthersProvider,
    useEthersSigner,
} from "../blockchain/networks/ethersAdapter";
import useNetworkData from "../blockchain/hooks/useNetworkData";
import StakingABI from "../blockchain/abi/stacking.json";
import TokenABI from "../blockchain/abi/tokenAbi.json";
import { ContractContext } from "./contractContext";

const ContractProvider = ({ children }: { children: React.ReactNode }) => {
    const provider = useEthersProvider();
    const signer = useEthersSigner();
    const network = useNetworkData();

    const { contract, token } = useMemo(() => {
        const contractInstance = new Contract(
            network.contract,
            StakingABI,
            signer || provider
        );

        const tokenInstance = new Contract(
            network.token,
            TokenABI,
            signer || provider
        );

        return { contract: contractInstance, token: tokenInstance };
    }, [network.contract, network.token, signer, provider]);

    return (
        <ContractContext.Provider value={{ contract, token }}>
            {children}
        </ContractContext.Provider>
    );
};

export default ContractProvider;