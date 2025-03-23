'use client'
import { useContractReads } from 'wagmi';
import { useMemo, useEffect, useState } from 'react';
import { createContractCalls, flattenCalls } from "../config/contractCallsConfig";
import { mockConfig, mockBlockchainData } from '../lib/mockData';

const useGetDataFromBlockChain = (address, formatFunction) => {
    // Memoize contract calls to prevent recreating on every render
    const {  flattenedCalls } = useMemo(() => ({
        flattenedCalls: address ? flattenCalls(createContractCalls(address)) : []
    }), [address]);

    const { data, isError, isLoading } = useContractReads({
        contracts: flattenedCalls,
        watch: true,
        enabled: !!address,
    });

    // Memoize processed data to prevent unnecessary recalculations
    const processedData = useMemo(() =>
        address && data ? formatFunction(data) : null
        , [address, data, formatFunction]);

    const [isErrorState, setIsError] = useState(isError);
    const [isLoadingState, setIsLoading] = useState(isLoading || (!!address && !data));
    const [processedDataState, setProcessedData] = useState(processedData);

    useEffect(() => {
        async function fetchData() {
            if (mockConfig.isTestMode) {
                try {
                    setProcessedData(formatFunction(mockBlockchainData));
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error processing mock data:', error);
                    setIsError(true);
                    setIsLoading(false);
                }
                return;
            }

            // Existing blockchain data fetching logic
            if (data) {
                setProcessedData(formatFunction(data));
                setIsLoading(false);
            }
        }

        fetchData();
    }, [address, data, formatFunction]);

    return {
        isError: isErrorState,
        isLoading: isLoadingState,
        processedData: processedDataState
    };
};

export default useGetDataFromBlockChain;
