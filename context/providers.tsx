"use client";

import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PrivyProvider } from "@privy-io/react-auth";
// Make sure to import these from `@privy-io/wagmi`, not `wagmi`
import { WagmiProvider } from '@privy-io/wagmi';

import { privyConfig } from "@/context/privyConfig";
import { wagmiConfig } from "@/context/wagmiConfig";

const queryClient = new QueryClient();

export default function Providers({children}: {children: ReactNode}) {
    return (
        <PrivyProvider 
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
            clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
            config={privyConfig}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
}