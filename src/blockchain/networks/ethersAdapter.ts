import { FallbackProvider, JsonRpcProvider } from "ethers";
import { useMemo } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import type { Account, Chain, Client, Transport } from "viem";
import { type Config, useClient, useConnectorClient } from "wagmi";

export function clientToProvider(client: Client<Transport, Chain>) {
   const { chain, transport } = client;
   const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
   };
   if (transport.type === "fallback") {
      const providers = (transport.transports as ReturnType<Transport>[]).map(({ value }) => new JsonRpcProvider(value?.url, network));
      if (providers.length === 1) return providers[0];
      return new FallbackProvider(providers);
   }
   return new JsonRpcProvider(transport.url, network);
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
   const client = useClient<Config>({ chainId });
   return useMemo(() => (client ? clientToProvider(client) : undefined), [client]);
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
   const { account, chain, transport } = client;
   const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
   };
   const provider = new BrowserProvider(transport, network);
   const signer = new JsonRpcSigner(provider, account.address);
   return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
   const { data: client } = useConnectorClient<Config>({ chainId });
   return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}