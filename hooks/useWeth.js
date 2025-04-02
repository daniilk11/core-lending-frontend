import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { useEffect } from 'react';
import { formatUnits, parseEther } from 'viem';
import { WETH_ADDRESS, WETH_ABI } from '../config/config'

const useWeth = (market, address) => {
    // Read ETH balance
    const { data: ethBalance } = useBalance({
        address,
        watch: true,
    });

    // Read WETH balance
    const { data: wethBalance, refetch: refetchWethBalance } = useReadContract({
        address: WETH_ADDRESS,
        abi: WETH_ABI,
        functionName: 'balanceOf',
        args: [address],
        watch: true,
    });

    const {
        writeContract: writeWeth,
        data: hash,
        isLoading: isProcessing,
        isSuccess: isSuccess,
        isError: isError,
        error: wethError,
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 1,
    });

    // Wrap ETH to WETH
    const handleWrapEth = async (amountInWei) => {
        writeWeth({
            address: WETH_ADDRESS,
            abi: WETH_ABI,
            functionName: 'deposit',
            value: amountInWei, // Send ETH with the transaction
        });
    };

    // Unwrap WETH to ETH
    const handleUnwrapEth = async (amountInWei) => {
        writeWeth({
            address: WETH_ADDRESS,
            abi: WETH_ABI,
            functionName: 'withdraw',
            args: [amountInWei],
        });
    };

    useEffect(() => {
        if (isConfirmed) refetchWethBalance();
    }, [isConfirmed]);

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