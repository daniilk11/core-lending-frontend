import React from "react";

/**
 * Modal button component that handles both connected and disconnected wallet states
 * Displays either an action button or a connect wallet button based on wallet connection
 * @param {Object} props - Component props
 * @param {string} [props.address] - User's wallet address
 * @param {boolean} [props.isDisabled] - Whether the action button is disabled
 * @param {boolean} [props.isProcessing] - Whether an action is in progress
 * @param {Function} [props.handleAction] - Callback for the action button
 * @param {Function} props.openConnectModal - Callback to open wallet connection modal
 * @param {string} [props.buttonLabel] - Label for the action button
 * @returns {React.ReactElement} Button modal component
 */
const ButtonModal = ({
  address,
  isDisabled,
  isProcessing,
  handleAction,
  openConnectModal,
  buttonLabel,
}) => {
  return address ? (
    // Action Button (when wallet is connected)
    <button
      className={`w-full py-3 rounded text-lg
                    ${
                      isDisabled || isProcessing
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#c8b6ff] hover:bg-[#b8c0ff] text-white"
                    }`}
      onClick={handleAction}
      disabled={isDisabled || isProcessing}
    >
      {buttonLabel}
    </button>
  ) : (
    // Connect Wallet Button (when wallet is not connected)
    <button
      className="w-full bg-[#c8b6ff] text-white py-3 rounded hover:bg-[#b8c0ff] text-lg"
      onClick={openConnectModal}
    >
      Connect Wallet
    </button>
  );
};

export default ButtonModal;
