import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect } from 'react';
import { lendingContractAddress, lendingContractABI, cTokenABI } from "../config/config";
import { parseUnits, formatUnits } from 'viem';
import { calculateMaxBorrowAmount } from '../utils/utils';

/**
 * Custom hook for handling borrowing functionality in the lending protocol
 * Manages borrow transactions, account information, and market data
 * @param {Object} market - The market object containing token details
 * @param {string} market.address - Address of the market contract
 * @param {string} market.cTokenAddress - Address of the cToken contract
 * @param {number} market.decimals - Number of decimals for the token
 * @param {number} market.price - Current price of the token
 * @param {number} market.exchangeRate - Exchange rate between token and cToken
 * @param {number} market.totalReserve - Total reserves in the market
 * @param {string} address - User's wallet address
 * @param {Object} accountInfo - User's account information
 * @param {number} accountInfo.totalCollateralValue - Total value of user's collateral
 * @param {number} accountInfo.totalBorrowedValue - Total value of user's borrowed assets
 * @returns {Object} Borrow-related functions and state
 * @returns {Function} returns.handleBorrow - Function to execute borrow transaction
 * @returns {boolean} returns.isBorrowing - Whether a borrow transaction is in progress
 * @returns {boolean} returns.isBorrowSuccess - Whether the last borrow transaction was successful
 * @returns {boolean} returns.isBorrowError - Whether the last borrow transaction failed
 * @returns {Error} returns.borrowError - Error from the last failed borrow transaction
 * @returns {number} returns.borrowLimit - Maximum amount user can borrow
 * @returns {number} returns.userBorrowData - Current borrow balance for the user
 * @returns {Object} returns.updatedAccountInfo - Latest account information
 */
const useBorrow = (market, address, accountInfo) => {
    // Initialize borrow limit based on account info and market parameters
    const [borrowLimit, setBorrowLimit] = useState(
        calculateMaxBorrowAmount({ accountInfo, market })
    );
    const [updatedAccountInfo, setUpdatedAccountInfo] = useState(accountInfo);

    // Contract write hook for executing borrow transactions
    const {
        writeContract: writeBorrow,
        data: hash,
        isLoading: isBorrowing,
        isSuccess: isInitialSubmitSuccess,
        isError: isBorrowError,
        error: borrowError
    } = useWriteContract();

    // Transaction receipt hook for monitoring transaction status
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 1,
    });

    /**
     * Handles the borrow transaction by converting amount to wei and executing the contract call
     * @param {string} amount - Amount to borrow in token units
     */
    const handleBorrow = async (amount) => {
        const amountInWei = parseUnits(amount, market.decimals);
        const config = {
            address: lendingContractAddress,
            abi: lendingContractABI,
            functionName: 'borrow',
            args: [market?.address, amountInWei],
        };
        writeBorrow(config);
    };

    // Contract read hooks for fetching user and market data
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

    // Fetch current borrow balance for the user
    const {
        data: userBorrowData,
        refetch: refetchUserBorrowData
    } = useReadContract({
        address: market.cTokenAddress,
        abi: cTokenABI,
        functionName: 'borrowBalanceCurrent',
        args: [address],
        watch: true,
    });

    // Fetch total supply of the market
    const {
        data: totalSupply,
        refetch: refetchTotalSupply
    } = useReadContract({
        address: market.cTokenAddress,
        abi: cTokenABI,
        functionName: 'totalSupply',
        args: [],
        watch: true,
    });

    // Fetch total borrows in the market
    const {
        data: totalBorrows,
        refetch: refetchTotalBorrows
    } = useReadContract({
        address: market.cTokenAddress,
        abi: cTokenABI,
        functionName: 'totalBorrows',
        args: [],
        watch: true,
    });

    // Update account info and borrow limit when user data changes
    useEffect(() => {
        if (userData) {
            // Convert and update account information
            const newAccountInfo = {
                totalCollateralValue: Number(formatUnits(userData[1], 18)),
                totalBorrowedValue: Number(formatUnits(userData[0], 18)),
            };
            setUpdatedAccountInfo(newAccountInfo);

            // Calculate and update borrow limit if total supply is available
            if (totalSupply) {
                const marketLiquidity = formatUnits(totalSupply, market.decimals) * market.exchangeRate - formatUnits(totalBorrows, market.decimals) - market.totalReserve;
                setBorrowLimit(
                    calculateMaxBorrowAmount(
                        {
                            accountInfo: newAccountInfo,
                            assetPrice: market.price,
                            marketLiquidity: marketLiquidity
                        })
                );
            }
        }
    }, [userData, totalSupply, totalBorrows, market]);

    // Refetch all relevant data after successful transaction
    useEffect(() => {
        if (isConfirmed) {
            refetchUserData();
            refetchUserBorrowData();
            refetchTotalSupply();
            refetchTotalBorrows();
        }
    }, [isConfirmed]);

    return {
        handleBorrow,
        isBorrowing: isBorrowing || isConfirming,
        isBorrowSuccess: isConfirmed,
        isBorrowError,
        borrowError,
        borrowLimit,
        userBorrowData: userBorrowData ? Number(formatUnits(userBorrowData, market.decimals)) : 0,
        updatedAccountInfo
    };
};

export default useBorrow;