'use client'
import { useReadContracts } from 'wagmi';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { createContractCalls, flattenCalls } from "../config/contractCallsConfig";
import { mockConfig, mockBlockchainData } from '../lib/mockData';

const useGetDataFromBlockChain = (address, formatFunction) => {
    const { flattenedCalls } = useMemo(() => ({
        flattenedCalls: address ? flattenCalls(createContractCalls(address)) : []
    }), [address]);

    // Add refetchKey to trigger manual refreshes
    const [refetchKey, setRefetchKey] = useState(0);

    const { data, isError, refetch } = useReadContracts({
        contracts: flattenedCalls,
        watch: true,
        enabled: !!address,
    });


    // todo delete Memoize processed data to prevent unnecessary recalculations
    const processedData = useMemo(() =>
        address && data ? formatFunction(data) : null
        ,
        [address, data, formatFunction]);

    const [isErrorState, setIsError] = useState(false);
    const [isLoadingState, setIsLoading] = useState(false);
    const [processedDataState, setProcessedData] = useState(null);

    // Manual refresh function
    const refresh = useCallback(async () => {
        if (!address) return;
        setIsLoading(true);
        try {
            await refetch();
        } catch (error) {
            console.error('Error refreshing data:', error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [address, refetch]);

    useEffect(() => {
        if (mockConfig.isTestMode) {
            setProcessedData(formatFunction(mockBlockchainData));
            setIsLoading(false);
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
    }, [address, data, isError, formatFunction, refetchKey]);

    return {
        isError: isErrorState,
        isLoading: isLoadingState,
        processedData: processedDataState,
        refresh
    };
};

export default useGetDataFromBlockChain;
