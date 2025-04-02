import React from "react";
import { formatUnits } from "viem";
import { calculateUSDPrice } from "../../utils/format";

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
      <label className="block text-sm font-medium mb-1">{name}</label>
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
      {userBalance ? (
        <p className="text-sm text-gray-500">
          Balance: {formatUnits(userBalance.value, userBalance.decimals)}{" "}
          {asset}
        </p>
      ) : null}
      <p className="text-sm text-gray-500">
        ≈ ${calculateUSDPrice(amount, price)}
      </p>
    </>
  );
};

export default InputModal;
