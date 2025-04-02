import { useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { erc20ABI, lendingContractAddress } from "../config/config";
import { useEffect } from 'react';

const useApprove = (market, address, isSupplySuccess) => {

    const { data: userBalance } = useBalance({
        address, token: market?.address
    });

    const { data: userAllowance, refetch: refetchAllowance } = useReadContract({
        address: market?.address,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, lendingContractAddress],
        watch: true,
    });

    const {
        writeContract: writeApprove,
        data: hash,
        isLoading: isApproving,
        isSuccess: isApproveSuccess,
        isError: isApproveError,
        error: approveError
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 1, // Wait for 1 block confirmation
    });

    const handleWriteApproveSpending = async (amountInWei) => {
        const config = {
            address: market?.address,
            abi: erc20ABI,
            functionName: 'approve',
            args: [lendingContractAddress, amountInWei],
        };
        await writeApprove(config);
    };

    useEffect(() => {
        if (isConfirmed || isSupplySuccess) {
            refetchAllowance();
        }
    }, [isConfirmed, isSupplySuccess]);

    return {
        userBalance,
        userAllowance,
        handleWriteApproveSpending,
        isApproving: isApproving || isConfirming,
        isApproveSuccess,
        isApproveError,
        approveError
    };
};

export default useApprove;
