import type {PrivyClientConfig} from '@privy-io/react-auth';
import { celo, optimism } from 'viem/chains';

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
    // Create embedded wallets for users who don't have a wallet
    defaultChain: celo,
    supportedChains: [celo, optimism],
    embeddedWallets: {
        ethereum: {
            createOnLogin: "users-without-wallets"
        }
    },
    loginMethods: ["email"]
};