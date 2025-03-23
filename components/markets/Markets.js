"use client"

import React, { useEffect, useState } from 'react';
import SupplyBorrowModal from '../modals/supplyBorrowModal/SupplyBorrowModal';
import MarketTable from './MarketTable';
import { useMarketState } from '../../hooks/useMarketState';
import MarketsInfo from "./MarketsInfo";
import MarketsHeader from "./MarketsHeader";
import LoadingMessage from "../LoadingMessage";
import { useAccount } from "wagmi";
import useGetDataFromBlockChain from "../../hooks/useGetDataFromBlockChain";
import { formatContractDataForMarkets } from "../../utils/format";
import WelcomeMessage from "../WelcomeMessage";
import ErrorMessage from "../ErrorMessage";
import { mockConfig } from '../../lib/mockData';

const Markets = () => {
    const [isClientSide, setIsClientSide] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState(null);
    const { address, isConnected } = useAccount();

    useEffect(() => {
        setIsClientSide(true);
    }, []);

    const { markets, setMarkets, marketsOverView, updateAssetValues } = useMarketState();
    const { isError, isLoading, processedData } = useGetDataFromBlockChain(address, formatContractDataForMarkets);

    const healthFactor = processedData?.newHealthFactor ?? null;
    const supplied = processedData?.allSuppliedAssetsValue ?? 0;
    const borrowed = processedData?.allBorrowedAssetsValue ?? 0;

    useEffect(() => {
        if (!processedData) return;
        setMarkets(processedData?.updatedMarkets ?? []);
        updateAssetValues(supplied, borrowed);
    }, [processedData]);

    if (!isClientSide) return null;

    if (!isConnected && !mockConfig.isTestMode) return <WelcomeMessage contentName="Markets" />;
    if (isLoading && !mockConfig.isTestMode) return <LoadingMessage contentName="Markets" />;
    if (isError && !mockConfig.isTestMode) return <ErrorMessage contentName="Markets" />;

    const handleViewDetails = (market) => {
        setSelectedMarket(market);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white text-purple-900">
            <main className="container mx-auto p-6">
                {selectedMarket && (
                    <SupplyBorrowModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        market={selectedMarket}
                        healthFactor={healthFactor}
                    />
                )}
                <MarketsHeader />
                <MarketsInfo marketsOverView={marketsOverView} />
                <MarketTable markets={markets} handleViewDetails={handleViewDetails} />
            </main>
        </div>
    );
};

export default Markets;
