import { http } from "wagmi";
import { createConfig } from "@privy-io/wagmi";

import { mantleSepoliaTestnet, optimism } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [mantleSepoliaTestnet, optimism],
  ssr: true,
  transports: {
    [mantleSepoliaTestnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    [optimism.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}