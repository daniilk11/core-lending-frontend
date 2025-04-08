'use client'
import { useReadContracts } from 'wagmi';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { createContractCalls, flattenCalls } from "../config/contractCallsConfig";
import { mockConfig, mockBlockchainData } from '../lib/mockData';

/**
 * Custom hook for fetching and processing blockchain data
 * Handles both live blockchain data and mock data in test mode
 * @param {string} address - User's wallet address
 * @param {Function} formatFunction - Function to format the raw blockchain data
 * @returns {Object} Blockchain data and state
 * @returns {boolean} returns.isError - Whether there was an error fetching data
 * @returns {boolean} returns.isLoading - Whether data is currently being fetched
 * @returns {Object} returns.processedData - Formatted blockchain data
 * @returns {Function} returns.refresh - Function to manually refresh the data
 */
const useGetDataFromBlockChain = (address, formatFunction) => {
    // State for error handling, loading status, and processed data
    const [isErrorState, setIsError] = useState(false);
    const [isLoadingState, setIsLoading] = useState(false);
    const [processedDataState, setProcessedData] = useState(null);

    // Check if we're in test mode
    const isTestMode = mockConfig.isTestMode;

    // Create contract calls configuration if not in test mode
    const { flattenedCalls } = useMemo(() => ({
        flattenedCalls: !isTestMode && address ? flattenCalls(createContractCalls(address)) : []
    }), [address, isTestMode]);

    // Fetch data from blockchain using wagmi's useReadContracts
    const { data, isError, refetch } = useReadContracts({
        contracts: flattenedCalls,
        watch: true,
        enabled: !isTestMode && !!address,
    });

    /**
     * Manual refresh function to update blockchain data
     * Handles both test mode and live blockchain data
     */
    const refresh = useCallback(async () => {
        if (!address) return;
        setIsLoading(true);
        try {
            if (isTestMode) {
                setProcessedData(formatFunction(mockBlockchainData));
            } else {
                await refetch();
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [address, refetch, isTestMode, formatFunction]);

    // Update processed data and states when blockchain data changes
    useEffect(() => {
        if (isTestMode) {
            setProcessedData(formatFunction(mockBlockchainData));
            setIsLoading(false);
            setIsError(false);
            return;
        }

        // Only show loading on initial fetch
        if (!data && !!address) {
            setIsLoading(true);
        } else if (data) {
            setProcessedData(formatFunction(data));
            setIsLoading(false);
        }

        setIsError(isError);
    }, [address, data, isError, formatFunction, isTestMode]);

    return {
        isError: isErrorState,
        isLoading: isLoadingState,
        processedData: processedDataState,
        refresh
    };
};

export default useGetDataFromBlockChain;
