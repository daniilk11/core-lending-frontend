import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { lendingContractABI, cTokenABI, lendingContractAddress } from "../config/config";
import { useEffect, useCallback } from 'react';
import { formatUnits } from 'viem';

const useSupply = (market, address) => {

    const { data: userSupplied, refetch: refetchUserSupply } = useReadContract({
        address: market?.cTokenAddress,
        abi: cTokenABI,
        functionName: 'balanceOfUnderlying',
        args: [address],
        watch: true,
    });

    const {
        writeContract: writeSupply,
        data: hash,
        isLoading: isSupplying,
        isSuccess: isSupplySuccess,
        isError: isSupplyError,
        error: supplyError
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 1, // Wait for 1 block confirmation
    });

    const handleWriteSupply = useCallback(async (amountInWei) => {
        if (isSupplying || isConfirming) return; // Prevent double calls

        const config = {
            address: lendingContractAddress,
            abi: lendingContractABI,
            functionName: 'deposit',
            args: [market?.address, amountInWei],
        };
        writeSupply(config);
    }, [market?.address, writeSupply, isSupplying, isConfirming]);

    useEffect(() => {
        if (isConfirmed) refetchUserSupply();
    }, [isConfirmed]);

    const formattedUserSupply = userSupplied ? Number(formatUnits(userSupplied, market?.decimals || 18)) : 0;

    return {
        handleWriteSupply,
        isSupplying: isSupplying || isConfirming,
        isSupplySuccess: isConfirmed,
        isSupplyError,
        supplyError,
        userSupplied: formattedUserSupply
    };
};

export default useSupply;
