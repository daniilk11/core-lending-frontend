import React from "react";

const ButtonModal = ({address, isDisabled, isProcessing, handleAction, openConnectModal, buttonLabel}) => {
    return (
        address ?
            <button
                className={
                    `w-full py-3 rounded text-lg
                    ${isDisabled || isProcessing
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-[#c8b6ff] hover:bg-[#b8c0ff] text-white'}`}
                onClick={handleAction}
                disabled={isDisabled || isProcessing}>
                {buttonLabel}
            </button>
            :
            <button
                className="w-full bg-[#c8b6ff] text-white py-3 rounded hover:bg-[#b8c0ff] text-lg"
                onClick={openConnectModal}>
                Connect Wallet
            </button>

    );
};

export default ButtonModal;
