import { http } from 'wagmi'
import { createConfig } from 'wagmi'
import {
  baseSepolia,
  sepolia,
} from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [
    baseSepolia,
    // mainnet,
    // polygon,
    // optimism,
    // arbitrum,
    // base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  transports: {
    // [mainnet.id]: http(),
    // [polygon.id]: http(),
    // [optimism.id]: http(),
    // [arbitrum.id]: http(),
    // [base.id]: http(),
    [baseSepolia.id]: http(),
    [sepolia.id]: http(),
  },
})