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

const DEFAULT_PROCESSED_DATA = {
    updatedMarkets: [],
    healthFactor: 0,
    marketsOverView: {},
    accountInfo: []
};

export default function Markets() {
    const { modalState, openModal, closeModal } = useModalState();
    const { address, isConnected } = useAccount();
    const [isInitializing, setIsInitializing] = useState(true);

    const {
        isError,
        isLoading,
        processedData = DEFAULT_PROCESSED_DATA
    } = useGetDataFromBlockChain(address, formatContractDataForMarkets);

    useEffect(() => {
        setIsInitializing(false);
    }, []);

    if (isInitializing) return null;
    if (!isConnected && !mockConfig.isTestMode) return <WelcomeMessage contentName="Markets" />;
    if (isLoading && !mockConfig.isTestMode) return <LoadingMessage contentName="Markets" />;
    if (isError && !mockConfig.isTestMode) return <ErrorMessage contentName="Markets" />;

    const handleViewDetails = (market) => {
        openModal(market);
    };

    return (
        <>
            <MarketsContent
                markets={processedData.updatedMarkets}
                marketsOverView={processedData.marketsOverView}
                onViewDetails={handleViewDetails}
            />
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