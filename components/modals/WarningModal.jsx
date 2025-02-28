import React from "react";

const WarningModal = ({}) => {
    return (
        <div className="p-3  bg-[#e7c6ff] rounded-md flex items-center space-x-1">
            <svg fill="none" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" color="#3b82f6"
                 stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                 viewBox="0 0 24 24" height="1em" width="1em"
                 style={{overflow: 'visible', color: '#3b82f6'}}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4M12 8h.01"></path>
            </svg>
            <p className="text-left text-sm font-medium whitespace-nowrap">
                To borrow you need to enable the asset as collateral before supply.
            </p>
        </div>
    );
};

export default WarningModal;
