import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { lendingContractABI, cTokenABI, lendingContractAddress } from "../config/config";
import {useEffect, useState} from 'react';
import { formatUnits } from 'viem';
import {calculateMaxBorrowAmount} from "../utils/utils";

const useRepay = (market, address) => {
    const [repayLimit, setRepayLimit] = useState('0');

    const { data: userBorrowed, refetch: refetchUserBorrow } = useReadContract({
        address: market?.cTokenAddress,
        abi: cTokenABI,
        functionName: 'borrowBalanceCurrent',
        args: [address],
        watch: true,
    });

    const {
        writeContract: writeRepay,
        data: hash,
        isLoading: isRepaying,
        isSuccess: isRepaySuccess,
        isError: isRepayError,
        error: repayError
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 1, // Wait for 1 block confirmation
    });

    const handleWriteRepay = async (amountInWei) => {
        const config = {
            address: lendingContractAddress,
            abi: lendingContractABI,
            functionName: 'repay',
            args: [market?.address, amountInWei],
        };
        writeRepay(config);
    };

    useEffect(() => {
        if (isConfirmed) refetchUserBorrow();
    }, [isConfirmed, refetchUserBorrow ]);

    useEffect(() => {
        const newLimit = userBorrowed ? (Number(formatUnits(userBorrowed, market?.decimals))) : 0
        // if (newLimit > 0.000001) setRepayLimit(newLimit.toFixed(6));
        // else setRepayLimit('0');
        setRepayLimit(newLimit.toFixed(9));
    }, [userBorrowed]);

    return {
        handleWriteRepay,
        isRepaying: isRepaying || isConfirming,
        isRepaySuccess: isConfirmed,
        isRepayError,
        repayError,
        repayLimit
    };
};

export default useRepay; 