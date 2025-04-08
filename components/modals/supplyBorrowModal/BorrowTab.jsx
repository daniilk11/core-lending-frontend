import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import useBorrow from "../../../hooks/useBorrow";
import InputModal from "../InputModal";
import ButtonModal from "../ButtonModal";
import DetailsSection from "./DetailsSection";
import { isValidAmount, calculateNewHealthFactor } from "../../../utils/utils";

/**
 * Component for handling token borrowing operations in the lending protocol
 * @param {Object} props - Component props
 * @param {Object} props.market - Market information including token details and rates
 * @param {string} props.address - User's wallet address
 * @param {Function} props.openConnectModal - Function to open wallet connection modal
 * @param {Object} props.accountInfo - User's account information including balances
 * @returns {React.ReactElement} Borrow tab component
 */
const BorrowTab = ({ market, address, openConnectModal, accountInfo }) => {
  // State for managing borrow operation
  const [amount, setAmount] = useState("0.00");
  const [canBorrow, setCanBorrow] = useState(false);

  // Custom hook for borrow operations
  const {
    handleBorrow,
    isBorrowing,
    isBorrowSuccess,
    isBorrowError,
    borrowError,
    borrowLimit,
    userBorrowData,
    updatedAccountInfo,
  } = useBorrow(market, address, accountInfo);

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
   * Handles the borrow operation
   */
  const handleBorrowClick = async () => {
    if (!address) {
      openConnectModal?.();
      return;
    }
    await handleBorrow(amount);
  };

  // Handle borrow success and error states
  useEffect(() => {
    if (isBorrowSuccess) {
      toast.success("Borrow successful!");
    }
    if (isBorrowError) {
      const errorMessage = borrowError?.message.includes(
        "User rejected the request"
      )
        ? "User rejected the request."
        : `Error borrowing tokens: ${borrowError?.message}`;
      toast.error(`Error borrowing tokens: ${errorMessage}`);
    }
  }, [isBorrowSuccess, isBorrowError, borrowError]);

  // Update borrow eligibility based on amount and limit
  useEffect(() => {
    setCanBorrow(
      isValidAmount({
        amount,
        maxAmount: borrowLimit,
      })
    );
  }, [amount, borrowLimit]);

  // Details section data for displaying borrow information
  const details = useMemo(
    () => [
      {
        label: "Max to borrow",
        value: `${borrowLimit} ${market.asset}`,
      },
      {
        label: "Borrow Limit",
        value: `$${((borrowLimit || 0) * market.price).toFixed(2)}`,
      },
      {
        label: "Amount Borrowed",
        value: `${userBorrowData.toFixed(6)} ${market.asset}`,
      },
      {
        label: "",
        value: `$${(userBorrowData * market.price).toFixed(2)}`,
      },
      {
        label: "New Health Factor",
        value: calculateNewHealthFactor(
          amount,
          updatedAccountInfo || accountInfo,
          market.price,
          market.ltv,
          "decrease"
        ).toFixed(2),
      },
      {
        label: "Borrow APY",
        value: `${market.borrowAPR || 0}%`,
      },
    ],
    [
      amount,
      updatedAccountInfo,
      accountInfo,
      borrowLimit,
      userBorrowData,
      market.asset,
      market.price,
      market.borrowAPR,
    ]
  );

  return (
    <div className="space-y-4">
      <InputModal
        handleAmountChange={handleAmountChange}
        name={"Amount to borrow"}
        asset={market.asset}
        amount={amount}
        price={market.price}
      />

      <DetailsSection details={details} />

      <ButtonModal
        address={address}
        isDisabled={!canBorrow}
        isProcessing={isBorrowing}
        openConnectModal={openConnectModal}
        buttonLabel={isBorrowing ? "Borrowing..." : "Borrow"}
        handleAction={handleBorrowClick}
      />
    </div>
  );
};

export default BorrowTab;
