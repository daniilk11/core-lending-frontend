'use client'

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import WelcomeMessage from '../WelcomeMessage';
import LoadingMessage from '../LoadingMessage';
import useGetDataFromBlockChain from "../../hooks/useGetDataFromBlockChain";
import { formatContractDataForDashboard } from "../../utils/format";
import ErrorMessage from "../ErrorMessage";
import SupplyBorrowModal from "../modals/supplyBorrowModal/SupplyBorrowModal";
import { mockConfig } from '../../lib/mockData';
import useModalState from '../../hooks/useModalState';
import DashboardContent from './DashboardContent';

/**
 * Default state for processed blockchain data
 * @type {Object}
 */
const DEFAULT_PROCESSED_DATA = {
    userPositions: {},
    overallPosition: {},
    marketsData: {},
    accountInfo: {},
};

/**
 * Main Dashboard component that displays user's lending positions and overall account status
 * Handles data fetching, loading states, and modal interactions
 * @returns {React.ReactElement|null} Dashboard component or null during initialization
 */
export default function Dashboard() {
    // State and hooks for modal and account management
    const { modalState, openModal, closeModal } = useModalState();
    const { address, isConnected } = useAccount();
    const [isInitializing, setIsInitializing] = useState(true);

    // Fetch and process blockchain data
    const {
        isError,
        isLoading,
        processedData = DEFAULT_PROCESSED_DATA
    } = useGetDataFromBlockChain(address, formatContractDataForDashboard);

    // Handle initialization state
    useEffect(() => {
        setIsInitializing(false);
    }, []);

    // Render appropriate component based on state
    if (isInitializing) return null;
    if (!isConnected && !mockConfig.isTestMode) return <WelcomeMessage contentName="Dashboard" />;
    if (isLoading && !mockConfig.isTestMode) return <LoadingMessage contentName="Dashboard" />;
    if (isError && !mockConfig.isTestMode) return <ErrorMessage contentName="Dashboard" />;

    /**
     * Handles viewing asset details and opening the supply/borrow modal
     * @param {string} asset - Asset identifier
     * @param {string} action - Action type (supply/borrow)
     */
    const handleViewDetails = (asset, action) => {
        openModal(processedData.marketsData[asset], action);
    };

    return (
        <>
            {/* Main Dashboard Content */}
            <DashboardContent
                processedData={processedData}
                onViewDetails={handleViewDetails}
            />
            {/* Supply/Borrow Modal */}
            {modalState.selectedMarket && (
                <SupplyBorrowModal
                    isOpen={modalState.isOpen}
                    onClose={closeModal}
                    market={modalState.selectedMarket}
                    activeTabName={modalState.activeTab}
                    healthFactor={processedData.overallPosition.healthFactor}
                    accountInfo={processedData.accountInfo}
                />
            )}
        </>
    );
} 