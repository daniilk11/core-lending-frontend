'use client'
import { useReadContracts } from 'wagmi';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { createContractCalls, flattenCalls } from "../config/contractCallsConfig";
import { mockConfig, mockBlockchainData } from '../lib/mockData';

const useGetDataFromBlockChain = (address, formatFunction) => {
    const [isErrorState, setIsError] = useState(false);
    const [isLoadingState, setIsLoading] = useState(false);
    const [processedDataState, setProcessedData] = useState(null);

    // Check test mode first
    const isTestMode = mockConfig.isTestMode;

    // Only create contract calls if not in test mode
    const { flattenedCalls } = useMemo(() => ({
        flattenedCalls: !isTestMode && address ? flattenCalls(createContractCalls(address)) : []
    }), [address, isTestMode]);

    const { data, isError, refetch } = useReadContracts({
        contracts: flattenedCalls,
        watch: true,
        enabled: !isTestMode && !!address,
    });

    // Manual refresh function
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
