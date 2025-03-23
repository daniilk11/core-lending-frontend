'use client'

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import OverallPosition from './OverallPosition';
import PositionsTable from './PositionsTable';
import WelcomeMessage from '../WelcomeMessage';
import LoadingMessage from '../LoadingMessage';
import useGetDataFromBlockChain from "../../hooks/useGetDataFromBlockChain";
import { formatContractDataForDashboard } from "../../utils/format";
import ErrorMessage from "../ErrorMessage";
import SupplyBorrowModal from "../modals/supplyBorrowModal/SupplyBorrowModal";
import { mockConfig } from '../../lib/mockData';

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState(null);
    const { address, isConnected } = useAccount();
    const [isInitializing, setIsInitializing] = useState(true);

    const { isError, isLoading, processedData } = useGetDataFromBlockChain(address, formatContractDataForDashboard);

    useEffect(() => {
        setIsInitializing(false);
    }, []);

    if (isInitializing) return null;

    const userPositions = processedData?.userPositions || [];
    const overallPosition = processedData?.overallPosition || {};

    const handleViewDetails = (market) => {
        if (market) {
            setSelectedMarket(market);
            setIsModalOpen(true);
        }
    };

    // Allow access in test mode even without wallet connection
    if (!isConnected && !mockConfig.isTestMode) return <WelcomeMessage contentName="Dashboard" />;
    if (isLoading && !mockConfig.isTestMode) return <LoadingMessage contentName="Dashboard" />;
    if (isError && !mockConfig.isTestMode) return <ErrorMessage contentName="Dashboard" />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white text-purple-900">
            <main className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-purple-800 mb-8">Your Dashboard</h1>
                <OverallPosition {...overallPosition} />
                <PositionsTable
                    userPositions={userPositions}
                    onViewDetails={handleViewDetails}
                />
                {selectedMarket &&
                    <SupplyBorrowModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        market={selectedMarket}
                        healthFactor={overallPosition.healthFactor}
                    />
                }
            </main>
        </div>
    );
} 