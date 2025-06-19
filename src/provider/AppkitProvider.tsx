import { createAppKit } from "@reown/appkit/react";

import { cookieStorage, createStorage, WagmiProvider } from "wagmi";
import { sepolia, mainnet } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { ReactNode } from "react";

console.log(import.meta.env.VITE_APP_APKIT_PROJECT_ID, "i am in appkit provider");
const projectId = import.meta.env.VITE_APP_APKIT_PROJECT_ID;

if (!projectId) {
    throw new Error("Missing a project id");
}

const queryClient = new QueryClient();
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia, mainnet];

const metadata = {
    name: "Axom Ai",
    description:
        "We are MCP protocol for Blockchain and real-world platforms like Maps, GitHub etc. Built on QEDA, it powers real-time, voice-driven execution with support for custom protocols.",
    url: "https://axom-staking.vercel.app",
    icons: ["https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7paugh4rmyy329ydgtbf.png"],
};

const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    networks,
    projectId,
    ssr: true,
});

export const AppkitProvider = ({ children }: { children: ReactNode }) => {
  
    createAppKit({
        adapters: [wagmiAdapter],
        networks,
        defaultNetwork: mainnet,
        projectId,
        metadata,
        features: {
            analytics: true,
            email: false,
            socials: false,
        },
        themeMode: "dark",
        debug: true,
        themeVariables: {
            "--w3m-border-radius-master": "0rem",
        }
    });

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
};