'use client'
import { useContractReads } from 'wagmi';
import { useMemo } from 'react';
import { createContractCalls, flattenCalls } from "../config/contractCallsConfig";

const useGetDataFromBlockChain = (address, formatFunction) => {
    // Memoize contract calls to prevent recreating on every render
    const { contractCalls, flattenedCalls } = useMemo(() => ({
        contractCalls: address ? createContractCalls(address) : {},
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

    return {
        isError,
        isLoading: isLoading || (!!address && !data),
        processedData
    };
};

export default useGetDataFromBlockChain;
