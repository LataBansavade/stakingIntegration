export const networks = {
    11155111: {
       contract: "0x1BD9cf0D783d9d0472FDd41Aa74dFa266c202c20",
       token: "0x0d99A82d54b7E7d6Aa72f919eD623d3964C7DDd8",
       explorerUrl: "https://sepolia.etherscan.io/",
    },
    1: {
       contract: "0x3de58474E23aBb64822825222CBAE8bC7314bE1f",
       token: "0x9095A3Da0c78505ae4BEEE099080a0b5eAB52DD2",
       explorerUrl: "https://etherscan.io/",
    },
 };
 
 export type ChainId = keyof typeof networks;
 
 export const getNetwork = (chainId: ChainId) => {
    if (!chainId || !networks[chainId]) return networks[1];
    return networks[chainId];
 };
 