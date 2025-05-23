import React, { useState, useEffect, useCallback, useMemo } from "react";
import { parseUnits } from "viem";
import { toast } from "react-toastify";
import InputModal from "../InputModal";
import ButtonModal from "../ButtonModal";
import { isValidNumber } from "../../../utils/format";
import useSupply from "../../../hooks/useSupply";
import useApprove from "../../../hooks/useApprove";
import useWeth from "../../../hooks/useWeth";
import DetailsSection from "./DetailsSection";
import { formatNumberToFixed, calculateUSDPrice } from "../../../utils/format";

/**
 * Component for handling token supply operations in the lending protocol
 * @param {Object} props - Component props
 * @param {Object} props.market - Market information including token details and rates
 * @param {string} props.address - User's wallet address
 * @param {number} props.healthFactor - User's health factor for the market
 * @param {Function} props.openConnectModal - Function to open wallet connection modal
 * @returns {React.ReactElement} Supply tab component
 */
const SupplyTab = ({ market, address, healthFactor, openConnectModal }) => {
  // State for managing supply operation
  const [needApprove, setNeedApprove] = useState(false);
  const [needWrap, setNeedWrap] = useState(false);
  const [amount, setAmount] = useState("0.00");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAmountValid, setIsAmountValid] = useState(false);

  // Custom hooks for supply, approval, and WETH operations
  const {
    handleWriteSupply,
    isSupplying,
    isSupplySuccess,
    isSupplyError,
    supplyError,
    userSupplied,
  } = useSupply(market, address);

  const {
    userBalance,
    userAllowance,
    handleWriteApproveSpending,
    isApproving,
    isApproveSuccess,
    isApproveError,
    approveError,
  } = useApprove(market, address, isSupplySuccess);

  const {
    handleWrapEth,
    isProcessing: isWrapping,
    isSuccess: isWrapSuccess,
    isError: isWrapError,
    wethError,
    wethBalance,
    isEthMarket,
    ethBalance,
  } = useWeth(market, address);

  /**
   * Handles input amount changes and validates the amount
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,18}$/;

    if (regex.test(inputValue) && inputValue >= 0) {
      setAmount(inputValue);
      const amountInWei = parseUnits(inputValue, market.decimals);
      setIsAmountValid(checkIfAmountValid(parseFloat(inputValue)));
      if (isValidNumber(userAllowance) && isValidNumber(amountInWei)) {
        setNeedApprove(amountInWei > userAllowance);
        setNeedWrap(
          isEthMarket &&
            parseFloat(inputValue) > 0 &&
            amountInWei > userBalance?.value
        );
      }
    }
  };

  /**
   * Handles the supply operation including approval and WETH wrapping if needed
   */
  const handleSupply = useCallback(async () => {
    if (!address) {
      openConnectModal?.();
      return;
    }

    if (isProcessing) return; // Prevent double calls
    setIsProcessing(true);

    try {
      const amountInWei = parseUnits(amount, market.decimals);
      if (isValidNumber(amountInWei)) {
        if (isEthMarket && needWrap) {
          await handleWrapEth(amountInWei);
        } else if (needApprove && amountInWei > userAllowance) {
          await handleWriteApproveSpending(amountInWei);
        } else {
          await handleWriteSupply(amountInWei);
        }
      }
    } catch (error) {
      toast.error("Transaction failed");
      setIsProcessing(false);
    }
  }, [
    address,
    amount,
    market.decimals,
    needWrap,
    needApprove,
    userAllowance,
    handleWrapEth,
    handleWriteApproveSpending,
    handleWriteSupply,
    isProcessing,
    openConnectModal,
    isEthMarket,
  ]);

  // Handle WETH wrapping success and error states
  useEffect(() => {
    if (isWrapSuccess) {
      toast.success("Successfully wrapped ETH to WETH!");
      setNeedWrap(false);
      setIsProcessing(false);
    }
    if (isWrapError) {
      toast.error(
        `Error wrapping ETH: ${wethError?.message || "Unknown error"}`
      );
      setIsProcessing(false);
    }
  }, [isWrapSuccess, isWrapError, wethError]);

  // Handle token approval success and error states
  useEffect(() => {
    if (isApproveSuccess) {
      toast.success("Successfully approved spending!");
      setNeedApprove(false);
      setIsProcessing(false);
    }
    if (isApproveError) {
      const errorMessage = approveError?.message.includes(
        "User rejected the request"
      )
        ? "User rejected the request."
        : `Error approving: ${approveError?.message}`;
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  }, [isApproveSuccess, isApproveError, approveError]);

  // Handle supply success and error states
  useEffect(() => {
    if (isSupplySuccess) {
      toast.success("Supply successful!");
      setAmount("0.00");
      setIsProcessing(false);
    }
    if (isSupplyError) {
      const errorMessage = supplyError?.message.includes(
        "User rejected the request"
      )
        ? "User rejected the request."
        : `Error supplying: ${supplyError?.message}`;
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  }, [isSupplySuccess, isSupplyError, supplyError]);

  // Details section data for displaying supply information
  const details = [
    {
      label: "Current Supply",
      value: `${formatNumberToFixed(userSupplied || 0)} ${market.asset}`,
    },
    { label: "New Supply Amount", value: `${amount} ${market.asset}` },
    { label: "", value: `$${calculateUSDPrice(amount, market.price)}` },
    { label: "LTV", value: `${market.ltv}%` },
    {
      label: "Increase in Borrow Limit",
      value: `$${calculateUSDPrice(amount, market.price * market.ltv)}`,
    },
    { label: "Supply APY", value: `${market?.supplyAPR || 0}%` },
  ];

  /**
   * Validates if the input amount is valid based on user's balance
   * @param {number} amount - Amount to validate
   * @returns {boolean} Whether the amount is valid
   */
  function checkIfAmountValid(amount) {
    if (!amount || amount <= 0) return false;

    if (isEthMarket) {
      // For ETH market, compare with raw ETH balance
      return amount <= ethBalance || 0n;
    }
    // For other markets, compare with raw token balance
    return amount <= userBalance?.value;
  }

  return (
    <div className="space-y-4">
      <InputModal
        handleAmountChange={handleAmountChange}
        name={
          isEthMarket ? "Amount of ETH to wrap and supply" : "Amount to deposit"
        }
        asset={market.asset}
        amount={amount}
        userBalance={userBalance}
        price={market.price}
      />
      <DetailsSection showCollateral={true} details={details} />
      <ButtonModal
        address={address}
        isDisabled={!isAmountValid}
        isProcessing={isProcessing || isSupplying || isWrapping || isApproving}
        openConnectModal={openConnectModal}
        buttonLabel={
          isEthMarket && needWrap
            ? isWrapping
              ? "Wrapping..."
              : "Wrap ETH"
            : needApprove
            ? isApproving
              ? "Approving..."
              : "Approve"
            : isSupplying
            ? "Supplying..."
            : "Supply"
        }
        handleAction={handleSupply}
      />
      <p>Current Allowance: {userAllowance?.toString()}</p>
    </div>
  );
};

export default SupplyTab;
