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

const DEFAULT_PROCESSED_DATA = {
    userPositions: {},
    overallPosition: {},
    marketsData: {},
    accountInfo: {},
};

export default function Dashboard() {
    const { modalState, openModal, closeModal } = useModalState();
    const { address, isConnected } = useAccount();
    const [isInitializing, setIsInitializing] = useState(true);

    const {
        isError,
        isLoading,
        processedData = DEFAULT_PROCESSED_DATA
    } = useGetDataFromBlockChain(address, formatContractDataForDashboard);

    useEffect(() => {
        setIsInitializing(false);
    }, []);

    if (isInitializing) return null;
    if (!isConnected && !mockConfig.isTestMode) return <WelcomeMessage contentName="Dashboard" />;
    if (isLoading && !mockConfig.isTestMode) return <LoadingMessage contentName="Dashboard" />;
    if (isError && !mockConfig.isTestMode) return <ErrorMessage contentName="Dashboard" />;

    const handleViewDetails = (asset, action) => {
        openModal(processedData.marketsData[asset], action);
    };

    return (
        <>
            <DashboardContent
                processedData={processedData}
                onViewDetails={handleViewDetails}
            />
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