import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { lendingContractABI, cTokenABI, lendingContractAddress } from "../config/config";
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { calculateMaxWithdrawableAmount } from '../utils/utils';

const useWithdraw = (market, address) => {
    const [maxWithdrawableAmount, setMaxWithdrawableAmount] = useState(0);

    const { data: userSupplied, refetch: refetchUserSupply } = useReadContract({
        address: market?.cTokenAddress,
        abi: cTokenABI,
        functionName: 'balanceOfUnderlying',
        args: [address],
        watch: true,
    });

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

    const {
        writeContract: writeWithdraw,
        data: hash,
        isLoading: isWithdrawing,
        isSuccess: isWithdrawSuccess,
        isError: isWithdrawError,
        error: withdrawError,
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 1, // Wait for 1 block confirmation
    });

    const handleWithdraw = async (amountInWei) => {
        const config = {
            address: lendingContractAddress,
            abi: lendingContractABI,
            functionName: 'withdraw',
            args: [market?.address, amountInWei],
        };
        writeWithdraw(config);
    };

    useEffect(() => {
        if (isConfirmed) {
            refetchUserSupply();
            refetchUserData();
        }
    }, [isConfirmed, refetchUserData, refetchUserSupply]);

    useEffect(() => {
        if (userData) {
            const newAccountInfo = {
                totalCollateralValue: Number(formatUnits(userData[1], 18)),
                totalBorrowedValue: Number(formatUnits(userData[0], 18)),
            };
            setMaxWithdrawableAmount( calculateMaxWithdrawableAmount({
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