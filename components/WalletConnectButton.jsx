import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * WalletConnectButton component provides a standardized wallet connection interface
 * using RainbowKit's ConnectButton. This component handles wallet connection,
 * disconnection, and wallet selection through a unified UI.
 *
 * @returns {JSX.Element} A wallet connection button with built-in wallet selection modal
 */
const WalletConnectButton = () => {
  return (
    <div>
      <ConnectButton label="Connect wallet" locale="en-US" />
    </div>
  );
};

export default WalletConnectButton;
