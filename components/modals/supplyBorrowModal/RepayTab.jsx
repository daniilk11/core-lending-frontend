import React, { useEffect, useState } from "react";
import { parseUnits } from "viem";
import { toast } from "react-toastify";
import InputModal from "../InputModal";
import DetailsSection from "./DetailsSection";
import ButtonModal from "../ButtonModal";
import useApprove from "../../../hooks/useApprove";
import useRepay from "../../../hooks/useRepay";
import { isValidNumber } from "../../../utils/format";
import { isValidAmount, calculateNewHealthFactor } from "../../../utils/utils";

const RepayTab = ({ market, address, openConnectModal, accountInfo }) => {
  const [needApprove, setNeedApprove] = useState(false);
  const [canRepay, setCanRepay] = useState(false);
  const [amount, setAmount] = useState("0.00");

  const {
    handleWriteRepay,
    isRepaying,
    isRepaySuccess,
    isRepayError,
    repayError,
    repayLimit,
  } = useRepay(market, address);

  const {
    userBalance,
    userAllowance,
    handleWriteApproveSpending,
    isApproving,
    isApproveSuccess,
    isApproveError,
    approveError,
  } = useApprove(market, address, isRepaySuccess);

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
      setCanRepay(
        isValidAmount({
          amount: inputValue,
          maxAmount: repayLimit,
        })
      );
    }
  };

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
          await handleWriteRepay(amountInWei);
        } catch (error) {
          toast.error("Repay transaction failed");
        }
      }
    }
  };

  useEffect(() => {
    if (isApproveSuccess) {
      toast.success("Successfully approved spending!");
      setNeedApprove(false);
    }
    if (isApproveError) {
      const errorMessage = approveError?.message.includes(
        "User rejected the request"
      )
        ? "User rejected the request."
        : `Error supplying tokens: ${approveError?.message}`;

      toast.error(`Error approving spending: ${errorMessage}`);
    }
  }, [isApproveSuccess, isApproveError, approveError]);

  useEffect(() => {
    if (isRepaySuccess) {
      toast.success("Repay successful!");
      setAmount("0.00");
    }
    if (isRepayError) {
      const errorMessage = repayError?.message.includes(
        "User rejected the request"
      )
        ? "User rejected the request."
        : `Error repaying tokens: ${repayError?.message}`;
      toast.error(errorMessage);
    }
  }, [isRepaySuccess, isRepayError, repayError]);

  const details = [
    {
      label: "Available to Repay",
      value: `${repayLimit} ${market.asset}`,
    },
    {
      label: "",
      value: `$${((repayLimit || 0) * market.price).toFixed(2)}`,
    },
    // {
    //   label: "New Health Factor",
    //   value: calculateNewHealthFactor(
    //     amount,
    //     accountInfo,
    //     market.price,
    //     market.ltv,
    //     "increase"
    //   ).toFixed(2),
    // },
    {
      label: "Remaining Debt After Repayment",
      value: `${Math.max(
        0,
        (market?.totalBorrows || 0) - parseFloat(amount)
      )} ${market.asset}`,
    },
    {
      label: "",
      value: `$${(
        Math.max(0, (market?.totalBorrows || 0) - parseFloat(amount)) *
        market.price
      ).toFixed(2)}`,
    },
    {
      label: "Borrow APY",
      value: `${market?.borrowAPR || 0}%`,
    },
  ];

  return (
    <div className="space-y-4">
      <InputModal
        handleAmountChange={handleAmountChange}
        name={"Amount to repay"}
        asset={market.asset}
        amount={amount}
        userBalance={userBalance}
        price={market.price}
      />

      <DetailsSection details={details} />

      <ButtonModal
        address={address}
        isDisabled={!canRepay}
        isProcessing={isRepaying}
        openConnectModal={openConnectModal}
        buttonLabel={
          needApprove
            ? "Approve"
            : isApproving
            ? "Approving..."
            : isRepaying
            ? "Repay..."
            : "Repay"
        }
        handleAction={handleRepay}
      />

      <p>Current Allowance: {userAllowance?.toString()}</p>
    </div>
  );
};

export default RepayTab;
