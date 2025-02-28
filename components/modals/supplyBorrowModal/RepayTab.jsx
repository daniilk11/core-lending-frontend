import React, {useEffect, useState} from "react";
import {useWriteContract} from "wagmi";
import {parseUnits} from "viem";
import {lendingContractABI, lendingContractAddress} from "../../../config/config";
import {toast} from "react-toastify";
import InputModal from "../InputModal";
import DetailsSection from "./DetailsSection";
import ButtonModal from "../ButtonModal";
import useApprove from "../../../hooks/useApprove";
import {isValidNumber} from "../../../utils/format";

const RepayTab = ({ market, address, healthFactor, openConnectModal }) => {
    const [amount, setAmount] = useState('0.00');
    const [needApprove, setNeedApprove] = useState(false);
    const [canRepay, setCanRepay] = useState(false);
    const [repayLimit, setRepayLimit] = useState(parseFloat(market?.totalBorrows) || 0);

    const {userBalance, userAllowance, handleWriteApproveSpending, isApproving, isApproveSuccess, isApproveError, approveError} = useApprove(market, address);

    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^\d*\.?\d{0,18}$/;

        if (regex.test(inputValue) && inputValue >= 0) {
            setAmount(inputValue);

            const amountInWei = parseUnits(e.target.value, market.decimals);
            if (isValidNumber(userAllowance) && isValidNumber(amountInWei)) {
                setNeedApprove(amountInWei > userAllowance);
            }

            // Can repay if amount is greater than 0 and less than or equal to user's borrow balance
            if (parseFloat(inputValue) !== 0 && parseFloat(inputValue) <= repayLimit) {
                setCanRepay(true);
            } else {
                setCanRepay(false);
            }
        }
    };

    const calculateNewHealthFactor = (amount) => {
        const amountInAsset = parseFloat(amount) || 0;
        // After repayment, total borrows will decrease
        const newTotalBorrowed = parseFloat(market?.totalBorrows) - amountInAsset;
        // Health factor improves as debt decreases
        return newTotalBorrowed > 0 ?
            (parseFloat(market?.totalSupply) * market?.ltv / 100) / newTotalBorrowed * 100 :
            Number.MAX_SAFE_INTEGER;
    };

    const {
        writeContract: writeRepay,
        isLoading: isRepaying,
        isSuccess: isRepaySuccess,
        isError: isRepayError,
        error: repayError
    } = useWriteContract();

    const handleRepay = async () => {
        if (!address) {
            openConnectModal?.();
            return;
        }

        const amountInWei = parseUnits(amount, market.decimals);
        if (isValidNumber(userAllowance) && isValidNumber(amountInWei)) {
            if (amountInWei > userAllowance) {
                await handleWriteApproveSpending(amountInWei);
            } else {
                try {
                    await writeRepay({
                        address: lendingContractAddress,
                        abi: lendingContractABI,
                        functionName: 'repay',
                        args: [market?.address, amountInWei],
                    });
                } catch (error) {
                    toast.error("Repay transaction failed");
                }
            }
        }
    };

    // // Listen for the "Repay" event from the contract  TODO mb use this for update UI
    // useContractEvent({
    //     address: lendingContractAddress,
    //     abi: contractABI,
    //     eventName: "Repay", // Replace with the actual event name
    //     listener: (repayer, token, amountRepaid) => {
    //         console.log(`Repay event detected: ${repayer} repaid ${amountRepaid} of ${token}`);
    //
    //         // Update UI state in response to the event
    //         if (repayer.toLowerCase() === address.toLowerCase()) {
    //             toast.success(`Repayment of ${parseFloat(amountRepaid).toFixed(2)} detected.`);
    //             setRepayLimit((prev) => prev - parseFloat(amountRepaid));
    //             setAmount('0.00');
    //         }
    //     },
    // });

    useEffect(() => {
        if (isApproveSuccess) {
            toast.success('Successfully approved spending!');
            setNeedApprove(false);
            userAllowance?.toString();
        }
        if (isApproveError) {
            const errorMessage = approveError?.message.includes("User rejected the request")
                ? "User rejected the request."
                : `Error supplying tokens: ${approveError?.message}`;

            toast.error(`Error approving spending: ${errorMessage}`);
        }
    }, [isApproveSuccess, isApproveError, approveError]);

    useEffect(() => {
        if (isRepaySuccess) {
            toast.success('Repay successful!');
            // Update repay limit after successful repayment
            setRepayLimit(parseFloat(market?.totalBorrows) - parseFloat(amount));
            setAmount('0.00'); // Reset input after successful repayment
        }
        if (isRepayError) {
            const errorMessage = repayError?.message.includes("User rejected the request")
                ? "User rejected the request."
                : `Error repaying tokens: ${repayError?.message}`;
            toast.error(errorMessage);
        }
    }, [isRepaySuccess, isRepayError, repayError]);

    const details = [
        {
            label: "Available to Repay",
            value: `${repayLimit} ${market.asset}`
        },
        {
            label: "Current Borrow Balance",
            value: `${market?.totalBorrows || 0} ${market.asset}`
        },
        {
            label: "",
            value: `$${((market?.totalBorrows || 0) * market.price).toFixed(2)}`
        },
        {
            label: "New Health Factor",
            value: calculateNewHealthFactor(amount).toFixed(2)
        },
        {
            label: "Remaining Debt After Repayment",
            value: `${Math.max(0, (market?.totalBorrows || 0) - parseFloat(amount))} ${market.asset}`
        },
        {
            label: "",
            value: `$${(Math.max(0, (market?.totalBorrows || 0) - parseFloat(amount)) * market.price).toFixed(2)}`
        },
        {
            label: "Borrow APY",
            value: `${market?.borrowApy || 0}%`
        }
    ];

    return (
        <div className="space-y-4">
            <InputModal
                handleAmountChange={handleAmountChange}
                name={"Amount to repay"}
                asset={market.asset}
                amount={amount}
                price={market.price}
            />

            <DetailsSection details={details} />

            <ButtonModal
                address={address}
                isDisabled={!canRepay}
                isProcessing={isRepaying}
                openConnectModal={openConnectModal}
                buttonLabel={needApprove ? 'Approve' : isApproving ? 'Approving...' : isRepaying ? 'Repay...' : 'Repay'}
                handleAction={handleRepay}
            />
            {/*TODO delete*/}
            <p>Current Allowance: {userAllowance?.toString()}</p>
        </div>
    );
};

export default RepayTab;