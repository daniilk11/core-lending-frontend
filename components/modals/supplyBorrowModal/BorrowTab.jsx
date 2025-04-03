import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import useBorrow from "../../../hooks/useBorrow";
import InputModal from "../InputModal";
import ButtonModal from "../ButtonModal";
import DetailsSection from "./DetailsSection";
import { isValidAmount, calculateNewHealthFactor } from "../../../utils/utils";

const BorrowTab = ({ market, address, openConnectModal, accountInfo }) => {
  const [amount, setAmount] = useState("0.00");
  const [canBorrow, setCanBorrow] = useState(false);

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

  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,18}$/;

    if (regex.test(inputValue) && inputValue >= 0) {
      setAmount(inputValue);
    }
  };

  const handleBorrowClick = async () => {
    if (!address) {
      openConnectModal?.();
      return;
    }
    await handleBorrow(amount);
  };

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

  useEffect(() => {
    setCanBorrow(
      isValidAmount({
        amount,
        maxAmount: borrowLimit,
      })
    );
  }, [amount, borrowLimit]);

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
