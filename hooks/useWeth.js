import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { useEffect } from 'react';
import { formatUnits, parseEther } from 'viem';
import { WETH_ADDRESS, WETH_ABI } from '../config/config'

/**
 * Custom hook for handling WETH (Wrapped Ether) operations
 * Manages wrapping ETH to WETH and unwrapping WETH back to ETH
 * @param {Object} market - The market object containing token details
 * @param {string} market.address - Address of the market contract
 * @param {string} address - User's wallet address
 * @returns {Object} WETH-related functions and state
 * @returns {Function} returns.handleWrapEth - Function to wrap ETH to WETH
 * @returns {Function} returns.handleUnwrapEth - Function to unwrap WETH to ETH
 * @returns {boolean} returns.isProcessing - Whether a transaction is in progress
 * @returns {boolean} returns.isSuccess - Whether the last transaction was successful
 * @returns {boolean} returns.isError - Whether the last transaction failed
 * @returns {Error} returns.wethError - Error from the last failed transaction
 * @returns {number} returns.wethBalance - Current WETH balance
 * @returns {number} returns.ethBalance - Current ETH balance
 * @returns {boolean} returns.isEthMarket - Whether the current market is for ETH/WETH
 */
const useWeth = (market, address) => {
    // Read ETH balance using wagmi's useBalance hook
    const { data: ethBalance } = useBalance({
        address,
        watch: true,
    });

    // Read WETH balance from the WETH contract
    const { data: wethBalance, refetch: refetchWethBalance } = useReadContract({
        address: WETH_ADDRESS,
        abi: WETH_ABI,
        functionName: 'balanceOf',
        args: [address],
        watch: true,
    });

    // Contract write hook for executing WETH transactions
    const {
        writeContract: writeWeth,
        data: hash,
        isLoading: isProcessing,
        isSuccess: isSuccess,
        isError: isError,
        error: wethError,
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
     * Wraps ETH to WETH by depositing ETH into the WETH contract
     * @param {bigint} amountInWei - Amount of ETH to wrap in wei
     */
    const handleWrapEth = async (amountInWei) => {
        writeWeth({
            address: WETH_ADDRESS,
            abi: WETH_ABI,
            functionName: 'deposit',
            value: amountInWei, // Send ETH with the transaction
        });
    };

    /**
     * Unwraps WETH to ETH by withdrawing from the WETH contract
     * @param {bigint} amountInWei - Amount of WETH to unwrap in wei
     */
    const handleUnwrapEth = async (amountInWei) => {
        writeWeth({
            address: WETH_ADDRESS,
            abi: WETH_ABI,
            functionName: 'withdraw',
            args: [amountInWei],
        });
    };

    // Refetch WETH balance after successful transaction
    useEffect(() => {
        if (isConfirmed) refetchWethBalance();
    }, [isConfirmed]);

    // Format balances and check if current market is ETH/WETH
    const isEthMarket = market?.address.toLowerCase() === WETH_ADDRESS;
    const formattedWethBalance = wethBalance ? Number(formatUnits(wethBalance, 18)) : 0;
    const formattedEthBalance = ethBalance ? Number(formatUnits(ethBalance.value, 18)) : 0;

    return {
        handleWrapEth,
        handleUnwrapEth,
        isProcessing: isProcessing || isConfirming,
        isSuccess: isConfirmed,
        isError,
        wethError,
        wethBalance: formattedWethBalance,
        ethBalance: formattedEthBalance,
        isEthMarket
    };
};

export default useWeth;