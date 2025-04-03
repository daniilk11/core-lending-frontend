import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect } from 'react';
import { lendingContractAddress, lendingContractABI, cTokenABI } from "../config/config";
import { parseUnits, formatUnits } from 'viem';
import { calculateMaxBorrowAmount } from '../utils/utils';

const useBorrow = (market, address, accountInfo) => {
    const [borrowLimit, setBorrowLimit] = useState(
        calculateMaxBorrowAmount({ accountInfo, market })
    );
    const [updatedAccountInfo, setUpdatedAccountInfo] = useState(accountInfo);

    const {
        writeContract: writeBorrow,
        data: hash,
        isLoading: isBorrowing,
        isSuccess: isInitialSubmitSuccess,
        isError: isBorrowError,
        error: borrowError
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 1,
    });

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
        data: userBorrowData,
        refetch: refetchUserBorrowData
    } = useReadContract({
        address: market.cTokenAddress,
        abi: cTokenABI,
        functionName: 'borrowBalanceCurrent',
        args: [address],
        watch: true,
    });

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
            const newAccountInfo = {
                totalCollateralValue: Number(formatUnits(userData[1], 18)),
                totalBorrowedValue: Number(formatUnits(userData[0], 18)),
            };
            setUpdatedAccountInfo(newAccountInfo);
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

    // Refetch data after successful transaction
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