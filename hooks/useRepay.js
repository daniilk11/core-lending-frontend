import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { lendingContractABI, cTokenABI, lendingContractAddress } from "../config/config";
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { calculateMaxBorrowAmount } from "../utils/utils";

/**
 * Custom hook for handling repayment functionality in the lending protocol
 * Manages repayment transactions and tracks user's borrowed amount
 * @param {Object} market - The market object containing token details
 * @param {string} market.address - Address of the market contract
 * @param {string} market.cTokenAddress - Address of the cToken contract
 * @param {number} market.decimals - Number of decimals for the token
 * @param {string} address - User's wallet address
 * @returns {Object} Repayment-related functions and state
 * @returns {Function} returns.handleWriteRepay - Function to execute repayment transaction
 * @returns {boolean} returns.isRepaying - Whether a repayment transaction is in progress
 * @returns {boolean} returns.isRepaySuccess - Whether the last repayment transaction was successful
 * @returns {boolean} returns.isRepayError - Whether the last repayment transaction failed
 * @returns {Error} returns.repayError - Error from the last failed repayment transaction
 * @returns {string} returns.repayLimit - Maximum amount user can repay
 */
const useRepay = (market, address) => {
    // State for maximum repayable amount
    const [repayLimit, setRepayLimit] = useState('0');

    // Fetch user's borrowed amount
    const { data: userBorrowed, refetch: refetchUserBorrow } = useReadContract({
        address: market?.cTokenAddress,
        abi: cTokenABI,
        functionName: 'borrowBalanceCurrent',
        args: [address],
        watch: true,
    });

    // Contract write hook for executing repayment transactions
    const {
        writeContract: writeRepay,
        data: hash,
        isLoading: isRepaying,
        isSuccess: isRepaySuccess,
        isError: isRepayError,
        error: repayError
    } = useWriteContract();

    // Transaction receipt hook for monitoring transaction status
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 1, // Wait for 1 block confirmation
    });

    /**
     * Handles the repayment transaction
     * @param {bigint} amountInWei - Amount to repay in wei
     */
    const handleWriteRepay = async (amountInWei) => {
        const config = {
            address: lendingContractAddress,
            abi: lendingContractABI,
            functionName: 'repay',
            args: [market?.address, amountInWei],
        };
        writeRepay(config);
    };

    // Refetch user's borrowed amount after successful transaction
    useEffect(() => {
        if (isConfirmed) refetchUserBorrow();
    }, [isConfirmed, refetchUserBorrow]);

    // Update repay limit when user's borrowed amount changes
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