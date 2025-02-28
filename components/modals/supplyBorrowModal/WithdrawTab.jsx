import React, {useEffect, useState} from "react";
import {useWriteContract} from "wagmi";
import {parseUnits} from "viem";
import {contractABI, lendingContractAddress} from "../../../config/config";
import {toast} from "react-toastify";
import InputModal from "../InputModal";
import DetailsSection from "./DetailsSection";
import ButtonModal from "../ButtonModal";

const WithdrawTab = ({ market, address, healthFactor, openConnectModal }) => {
    const [amount, setAmount] = useState('0.00');
    const [canWithdraw, setCanWithdraw] = useState(false);
    const [withdrawLimit, setWithdrawLimit] = useState(parseFloat(market?.totalSupply) || 0);

    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^\d*\.?\d{0,18}$/;

        if (regex.test(inputValue) && inputValue >= 0) {
            setAmount(inputValue);

            // Check if withdrawal would maintain health factor and is within limits
            const newHealthFactor = calculateNewHealthFactor(inputValue);
            if (parseFloat(inputValue) !== 0 &&
                parseFloat(inputValue) <= withdrawLimit &&
                newHealthFactor >= 1.0) {
                setCanWithdraw(true);
            } else {
                setCanWithdraw(false);
            }
        }
    };

    const calculateNewHealthFactor = (withdrawAmount) => {
        const amountInAsset = parseFloat(withdrawAmount) || 0;
        const newTotalCollateral = parseFloat(market?.totalSupply) - amountInAsset;

        // If there are no borrows, health factor is maximum
        if (parseFloat(market?.totalBorrows) === 0) {
            return Number.MAX_SAFE_INTEGER;
        }

        // Calculate new health factor after withdrawal
        // (remaining collateral * LTV) / total borrows
        return ((newTotalCollateral * market?.ltv / 100) / market?.totalBorrows) * 100;
    };

    const {
        writeContract: writeWithdraw,
        isLoading: isWithdrawing,
        isSuccess: isWithdrawSuccess,
        isError: isWithdrawError,
        error: withdrawError
    } = useWriteContract();

    const handleWithdraw = async () => {
        if (!address) {
            openConnectModal?.();
            return;
        }

        // Convert cToken amount based on exchange rate
        // Assuming exchange rate is 1:1 for simplicity - adjust based on your actual exchange rate
        const cTokenAmount = parseUnits(amount, market.decimals);

        try {
            await writeWithdraw({
                address: lendingContractAddress,
                abi: contractABI,
                functionName: 'withdraw',
                args: [market?.address, cTokenAmount],
            });
        } catch (error) {
            toast.error("Withdraw transaction failed");
        }
    };

    useEffect(() => {
        if (isWithdrawSuccess) {
            toast.success('Withdraw successful!');
            // Update withdrawal limit after successful withdrawal
            setWithdrawLimit(parseFloat(market?.totalSupply) - parseFloat(amount));
            setAmount('0.00'); // Reset input after successful withdrawal
        }
        if (isWithdrawError) {
            const errorMessage = withdrawError?.message.includes("User rejected the request")
                ? "User rejected the request."
                : `Error withdrawing tokens: ${withdrawError?.message}`;
            toast.error(errorMessage);
        }
    }, [isWithdrawSuccess, isWithdrawError, withdrawError]);

    const maxWithdrawableAmount = Math.min(
        withdrawLimit,
        market?.totalBorrows ? (withdrawLimit * market?.ltv / 100) : withdrawLimit
    );

    const details = [
        {
            label: "Available to Withdraw",
            value: `${maxWithdrawableAmount.toFixed(6)} ${market.asset}`
        },
        {
            label: "",
            value: `$${(maxWithdrawableAmount * market.price).toFixed(2)}`
        },
        {
            label: "Current Supply Balance",
            value: `${market?.totalSupply || 0} ${market.asset}`
        },
        {
            label: "",
            value: `$${((market?.totalSupply || 0) * market.price).toFixed(2)}`
        },
        {
            label: "New Health Factor",
            value: calculateNewHealthFactor(amount).toFixed(2)
        },
        {
            label: "Remaining Supply After Withdrawal",
            value: `${Math.max(0, (market?.totalSupply || 0) - parseFloat(amount))} ${market.asset}`
        },
        {
            label: "",
            value: `$${(Math.max(0, (market?.totalSupply || 0) - parseFloat(amount)) * market.price).toFixed(2)}`
        },
        {
            label: "Supply APY",
            value: `${market?.supplyApy || 0}%`
        }
    ];

    return (
        <div className="space-y-4">
            <InputModal
                handleAmountChange={handleAmountChange}
                name={"Amount to withdraw"}
                asset={market.asset}
                amount={amount}
                price={market.price}
                maxAmount={maxWithdrawableAmount}
            />
            <DetailsSection details={details} />
            <ButtonModal
                address={address}
                isDisabled={!canWithdraw}
                isProcessing={isWithdrawing}
                openConnectModal={openConnectModal}
                buttonLabel={isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                handleAction={handleWithdraw}
            />
        </div>
    );
};

export default WithdrawTab;