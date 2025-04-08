"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ToastContainer } from "react-toastify";
import { wagmiConfig } from "../wagmi";

// Initialize QueryClient with default options for data fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable automatic refetching on window focus
      staleTime: 0, // Consider data immediately stale to ensure fresh fetches
    },
  },
});

/**
 * Providers component wraps the application with necessary providers for:
 * - Wagmi (Ethereum interactions)
 * - React Query (Data fetching and caching)
 * - RainbowKit (Wallet connection)
 * - Toast notifications
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by providers
 * @returns {JSX.Element} Application wrapped with all necessary providers
 */
export default function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
          <ToastContainer />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
