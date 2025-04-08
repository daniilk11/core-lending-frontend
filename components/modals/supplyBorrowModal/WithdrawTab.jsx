import React, { useState, useEffect, useMemo } from "react";
import { parseUnits } from "viem";
import { toast } from "react-toastify";
import InputModal from "../InputModal";
import ButtonModal from "../ButtonModal";
import useWithdraw from "../../../hooks/useWithdraw";
import DetailsSection from "./DetailsSection";
import { formatNumberToFixed, calculateUSDPrice } from "../../../utils/format";
import { calculateNewHealthFactor, isValidAmount } from "../../../utils/utils";

/**
 * Component for handling token withdrawal operations in the lending protocol
 * @param {Object} props - Component props
 * @param {Object} props.market - Market information including token details and rates
 * @param {string} props.address - User's wallet address
 * @param {Function} props.openConnectModal - Function to open wallet connection modal
 * @param {Object} props.accountInfo - User's account information including balances
 * @returns {React.ReactElement} Withdraw tab component
 */
const WithdrawTab = ({ market, address, openConnectModal, accountInfo }) => {
  // State for managing withdraw operation
  const [amount, setAmount] = useState("0.0");
  const [canWithdraw, setCanWithdraw] = useState(false);

  // Custom hook for withdraw operations
  const {
    handleWithdraw,
    isWithdrawing,
    isWithdrawSuccess,
    isWithdrawError,
    withdrawError,
    userSupplied,
    maxWithdrawableAmount,
  } = useWithdraw(market, address);

  /**
   * Handles input amount changes and validates the amount
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,18}$/;

    if (regex.test(inputValue) && inputValue >= 0) {
      setAmount(inputValue);
    }
  };

  /**
   * Handles the withdraw operation
   */
  const handleWithdrawClick = async () => {
    if (!address) {
      openConnectModal?.();
      return;
    }
    const amountInWei = parseUnits(amount, market.decimals);
    await handleWithdraw(amountInWei);
  };

  // Handle withdraw success and error states
  useEffect(() => {
    if (isWithdrawSuccess) {
      toast.success("Withdraw successful!");
    }
    if (isWithdrawError) {
      const errorMessage = withdrawError?.message.includes(
        "User rejected the request"
      )
        ? "User rejected the request."
        : `Error withdrawing tokens: ${withdrawError?.message}`;
      toast.error(`Error withdrawing tokens: ${errorMessage}`);
    }
  }, [isWithdrawSuccess, isWithdrawError, withdrawError]);

  // Update withdraw eligibility based on amount and limit
  useEffect(() => {
    setCanWithdraw(
      isValidAmount({
        amount,
        maxAmount: maxWithdrawableAmount,
      })
    );
  }, [amount, maxWithdrawableAmount]);

  // Details section data for displaying withdraw information
  const details = useMemo(
    () => [
      {
        label: "Available to Withdraw",
        value: `${formatNumberToFixed(maxWithdrawableAmount)} ${market.asset}`,
      },
      {
        label: "",
        value: `$${calculateUSDPrice(maxWithdrawableAmount, market.price)}`,
      },
      {
        label: "Current Supply Balance",
        value: `${formatNumberToFixed(userSupplied || 0)} ${market.asset}`,
      },
      {
        label: "",
        value: `$${calculateUSDPrice(userSupplied || 0, market.price)}`,
      },
      {
        label: "New Health Factor",
        value: calculateNewHealthFactor(
          amount,
          accountInfo,
          market.price,
          market.ltv,
          "decrease"
        ).toFixed(2),
      },
      {
        label: "Remaining Supply After Withdrawal",
        value: `${formatNumberToFixed(
          Math.max(0, (userSupplied || 0) - parseFloat(amount))
        )} ${market.asset}`,
      },
      {
        label: "",
        value: `$${calculateUSDPrice(
          Math.max(0, (userSupplied || 0) - parseFloat(amount)),
          market.price
        )}`,
      },
      {
        label: "Supply APY",
        value: `${market?.supplyAPR || 0}%`,
      },
    ],
    [
      amount,
      userSupplied,
      market.asset,
      market.price,
      market.supplyAPR,
      maxWithdrawableAmount,
      accountInfo,
      market,
    ]
  );

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
        buttonLabel={isWithdrawing ? "Withdrawing..." : "Withdraw"}
        handleAction={handleWithdrawClick}
      />
    </div>
  );
};

export default WithdrawTab;
