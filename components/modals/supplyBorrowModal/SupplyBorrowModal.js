import React, { useState, useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import SupplyTab from './SupplyTab';
import BorrowTab from './BorrowTab';
import { useAccount } from "wagmi";
import RepayTab from "./RepayTab";
import WithdrawTab from "./WithdrawTab";

/**
 * Modal component for handling supply, borrow, repay, and withdraw operations
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {Object} props.market - Market information including token details and rates
 * @param {number} props.healthFactor - User's health factor for the market
 * @param {string} props.activeTabName - Initial active tab name (default: 'supply')
 * @param {Object} props.accountInfo - User's account information including balances
 * @returns {React.ReactElement|null} Modal component or null if not open
 */
const SupplyBorrowModal = ({ isOpen, onClose, market, healthFactor, activeTabName = 'supply', accountInfo }) => {
    // State for managing active tab
    const [activeTab, setActiveTab] = useState(activeTabName);
    const { address } = useAccount();
    const { openConnectModal } = useConnectModal();

    // Handle body scroll lock when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Return null if modal is not open or market data is not available
    if (!isOpen || !market) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[515px]">
                {/* Modal Header with Tab Navigation */}
                <div className="mb-4">
                    <div className="flex justify-between border-b border-[#e7c6ff]">
                        <div className="flex">
                            {/* Supply Tab Button */}
                            <button
                                className={`py-2 px-4 text-lg ${activeTab === 'supply' ? 'border-b-2 border-[#c8b6ff] text-[#c8b6ff]' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('supply')}
                            >
                                Supply
                            </button>
                            {/* Borrow Tab Button */}
                            <button
                                className={`py-2 px-4 text-lg ${activeTab === 'borrow' ? 'border-b-2 border-[#c8b6ff] text-[#c8b6ff]' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('borrow')}
                            >
                                Borrow
                            </button>
                            {/* Repay Tab Button */}
                            <button
                                className={`py-2 px-4 text-lg ${activeTab === 'repay' ? 'border-b-2 border-[#c8b6ff] text-[#c8b6ff]' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('repay')}
                            >
                                Repay
                            </button>
                            {/* Withdraw Tab Button */}
                            <button
                                className={`py-2 px-4 text-lg ${activeTab === 'withdraw' ? 'border-b-2 border-[#c8b6ff] text-[#c8b6ff]' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('withdraw')}
                            >
                                Withdraw
                            </button>
                        </div>
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl px-4"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'supply' && (
                    <SupplyTab
                        market={market}
                        address={address}
                        healthFactor={healthFactor}
                        openConnectModal={openConnectModal}
                    />
                )}
                {activeTab === 'borrow' && (
                    <BorrowTab
                        market={market}
                        address={address}
                        openConnectModal={openConnectModal}
                        accountInfo={accountInfo}
                    />
                )}
                {activeTab === 'repay' && (
                    <RepayTab
                        market={market}
                        address={address}
                        openConnectModal={openConnectModal}
                        accountInfo={accountInfo}
                    />
                )}
                {activeTab === 'withdraw' && (
                    <WithdrawTab
                        market={market}
                        address={address}
                        openConnectModal={openConnectModal}
                        accountInfo={accountInfo}
                    />
                )}
            </div>
        </div>
    );
};

export default SupplyBorrowModal;
