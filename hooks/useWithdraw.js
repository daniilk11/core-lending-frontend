import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { lendingContractABI, cTokenABI, lendingContractAddress } from "../config/config";
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { calculateMaxWithdrawableAmount } from '../utils/utils';

/**
 * Custom hook for handling withdrawal functionality in the lending protocol
 * Manages withdrawal transactions and calculates maximum withdrawable amounts
 * @param {Object} market - The market object containing token details
 * @param {string} market.address - Address of the market contract
 * @param {string} market.cTokenAddress - Address of the cToken contract
 * @param {number} market.decimals - Number of decimals for the token
 * @param {string} address - User's wallet address
 * @returns {Object} Withdrawal-related functions and state
 * @returns {Function} returns.handleWithdraw - Function to execute withdrawal transaction
 * @returns {boolean} returns.isWithdrawing - Whether a withdrawal transaction is in progress
 * @returns {boolean} returns.isWithdrawSuccess - Whether the last withdrawal transaction was successful
 * @returns {boolean} returns.isWithdrawError - Whether the last withdrawal transaction failed
 * @returns {Error} returns.withdrawError - Error from the last failed withdrawal transaction
 * @returns {number} returns.userSupplied - Current amount supplied by the user
 * @returns {number} returns.maxWithdrawableAmount - Maximum amount user can withdraw
 */
const useWithdraw = (market, address) => {
    // State for maximum withdrawable amount
    const [maxWithdrawableAmount, setMaxWithdrawableAmount] = useState(0);

    // Fetch user's supplied amount
    const { data: userSupplied, refetch: refetchUserSupply } = useReadContract({
        address: market?.cTokenAddress,
        abi: cTokenABI,
        functionName: 'balanceOfUnderlying',
        args: [address],
        watch: true,
    });

    // Fetch user's account information
    const {
        data: userData,
        refetch: refetchUserData
    } = useReadContract({
        address: lendingContractAddress,
        abi: lendingContractABI,
        functionName: 'getAccountInformation',
        args: [address],
        watch: true,
    });

    // Contract write hook for executing withdrawal transactions
    const {
        writeContract: writeWithdraw,
        data: hash,
        isLoading: isWithdrawing,
        isSuccess: isWithdrawSuccess,
        isError: isWithdrawError,
        error: withdrawError,
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
     * Handles the withdrawal transaction
     * @param {bigint} amountInWei - Amount to withdraw in wei
     */
    const handleWithdraw = async (amountInWei) => {
        const config = {
            address: lendingContractAddress,
            abi: lendingContractABI,
            functionName: 'withdraw',
            args: [market?.address, amountInWei],
        };
        writeWithdraw(config);
    };

    // Refetch user data after successful transaction
    useEffect(() => {
        if (isConfirmed) {
            refetchUserSupply();
            refetchUserData();
        }
    }, [isConfirmed, refetchUserData, refetchUserSupply]);

    // Update maximum withdrawable amount when user data changes
    useEffect(() => {
        if (userData) {
            const newAccountInfo = {
                totalCollateralValue: Number(formatUnits(userData[1], 18)),
                totalBorrowedValue: Number(formatUnits(userData[0], 18)),
            };
            setMaxWithdrawableAmount(calculateMaxWithdrawableAmount({
                accountInfo: newAccountInfo,
                market,
                userSupplied: userSupplied ? Number(formatUnits(userSupplied, market.decimals)) : 0
            }));
        }
    }, [userData, market, userSupplied]);

    return {
        handleWithdraw,
        isWithdrawing: isWithdrawing || isConfirming,
        isWithdrawSuccess,
        isWithdrawError,
        withdrawError,
        userSupplied: userSupplied ? Number(formatUnits(userSupplied, market.decimals)) : 0,
        maxWithdrawableAmount
    };
};

export default useWithdraw;