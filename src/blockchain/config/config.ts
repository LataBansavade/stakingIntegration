import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = '27c02ad8d53f4ffcb328c966f6491f86'

export const config = createConfig({
  chains: [mainnet, sepolia],
    connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
