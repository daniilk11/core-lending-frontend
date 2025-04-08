'use client'

import React, { useEffect, useState } from 'react';
import SupplyBorrowModal from '../modals/supplyBorrowModal/SupplyBorrowModal';
import LoadingMessage from "../LoadingMessage";
import { useAccount } from "wagmi";
import useGetDataFromBlockChain from "../../hooks/useGetDataFromBlockChain";
import { formatContractDataForMarkets } from "../../utils/format";
import WelcomeMessage from "../WelcomeMessage";
import ErrorMessage from "../ErrorMessage";
import { mockConfig } from '../../lib/mockData';
import useModalState from '../../hooks/useModalState';
import MarketsContent from './MarketsContent';

/**
 * Default state for processed blockchain data
 * @type {Object}
 */
const DEFAULT_PROCESSED_DATA = {
    updatedMarkets: [],
    healthFactor: 0,
    marketsOverView: {},
    accountInfo: []
};

/**
 * Main component for displaying and managing lending markets
 * @returns {React.ReactElement|null} Markets component or null during initialization
 */
export default function Markets() {
    // State and hooks for modal and account management
    const { modalState, openModal, closeModal } = useModalState();
    const { address, isConnected } = useAccount();
    const [isInitializing, setIsInitializing] = useState(true);

    // Fetch and process blockchain data
    const {
        isError,
        isLoading,
        processedData = DEFAULT_PROCESSED_DATA
    } = useGetDataFromBlockChain(address, formatContractDataForMarkets);

    // Handle initialization state
    useEffect(() => {
        setIsInitializing(false);
    }, []);

    // Render appropriate component based on state
    if (isInitializing) return null;
    if (!isConnected && !mockConfig.isTestMode) return <WelcomeMessage contentName="Markets" />;
    if (isLoading && !mockConfig.isTestMode) return <LoadingMessage contentName="Markets" />;
    if (isError && !mockConfig.isTestMode) return <ErrorMessage contentName="Markets" />;

    /**
     * Handles viewing market details and opening the supply/borrow modal
     * @param {Object} market - Market object to view details for
     */
    const handleViewDetails = (market) => {
        openModal(market);
    };

    return (
        <>
            {/* Main Markets Content */}
            <MarketsContent
                markets={processedData.updatedMarkets}
                marketsOverView={processedData.marketsOverView}
                onViewDetails={handleViewDetails}
            />
            {/* Supply/Borrow Modal */}
            {modalState.selectedMarket && (
                <SupplyBorrowModal
                    isOpen={modalState.isOpen}
                    onClose={closeModal}
                    market={modalState.selectedMarket}
                    healthFactor={processedData.healthFactor}
                    accountInfo={processedData.accountInfo}
                />
            )}
        </>
    );
}