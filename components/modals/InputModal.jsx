import React from "react";
import { formatUnits } from "viem";
import { calculateUSDPrice } from "../../utils/format";

/**
 * Modal component for handling numeric input with asset information
 * Displays input field, asset symbol, balance, and USD value
 * @param {Object} props - Component props
 * @param {string} props.name - Label for the input field
 * @param {Function} props.handleAmountChange - Callback for amount changes
 * @param {string} props.asset - Asset identifier
 * @param {number} props.amount - Current input amount
 * @param {number} props.price - Current asset price in USD
 * @param {Object} [props.userBalance] - User's balance information
 * @param {bigint} props.userBalance.value - Balance value in wei
 * @param {number} props.userBalance.decimals - Number of decimal places
 * @returns {React.ReactElement} Input modal component
 */
const InputModal = ({
  name,
  handleAmountChange,
  asset,
  amount,
  price,
  userBalance,
}) => {
  return (
    <>
      {/* Input Label */}
      <label className="block text-sm font-medium mb-1">{name}</label>

      {/* Input Field with Asset Symbol */}
      <div className="flex items-center">
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="flex-grow border border-[#b8c0ff] rounded-l px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-[#c8b6ff]"
          placeholder="0,00"
        />
        <span className="bg-[#bbd0ff] px-3 py-2 rounded-r text-lg">
          {asset}
        </span>
      </div>

      {/* Balance Display */}
      {userBalance ? (
        <p className="text-sm text-gray-500">
          Balance: {formatUnits(userBalance.value, userBalance.decimals)}{" "}
          {asset}
        </p>
      ) : null}

      {/* USD Value Display */}
      <p className="text-sm text-gray-500">
        ≈ ${calculateUSDPrice(amount, price)}
      </p>
    </>
  );
};

export default InputModal;
