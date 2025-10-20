import { http } from "wagmi";
import { createConfig } from "@privy-io/wagmi";

import { celo, optimism } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [celo, optimism],
  ssr: true,
  transports: {
    [celo.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    [optimism.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}