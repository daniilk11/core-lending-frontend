import React from "react";

/**
 * Modal component displaying detailed information about a lending position
 * Shows collateral settings, supplied amount, LTV, borrow limit, and APY
 * @param {Object} props - Component props
 * @param {string} props.name - Name of the position
 * @param {Function} props.handleAmountChange - Callback for amount changes
 * @param {string} props.asset - Asset identifier
 * @param {number} props.amount - Current amount supplied
 * @returns {React.ReactElement} Details modal component
 */
const DetailsModal = ({ name, handleAmountChange, asset, amount }) => {
  return (
    <div className="space-y-4">
      {/* Modal Header */}
      <h4 className="font-medium text-lg text-[#c8b6ff]">Details</h4>

      {/* Collateral Toggle Section */}
      <div className="flex items-center justify-between">
        <span>Use as collateral</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useAsCollateral}
            onChange={handleCollateralToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c8b6ff]"></div>
        </label>
      </div>

      {/* Position Details Section */}
      <div className="space-y-2 text-sm">
        {/* Amount Supplied */}
        <div className="flex justify-between">
          <span>Amount Supplied</span>
          <span>
            {amount} {market.asset}
          </span>
        </div>
        {/* Loan to Value Ratio */}
        <div className="flex justify-between">
          <span>LTV</span>
          <span>{market.ltv}</span>
        </div>
        {/* Borrow Limit Impact */}
        <div className="flex justify-between">
          <span>Increase in Borrow Limit</span>
          {/*<span>+${calculateBorrowLimit()}</span>*/}
        </div>
        {/* Supply APY */}
        <div className="flex justify-between">
          <span>Supply APY</span>
          <span>{market?.supplyAPR || 0}%</span>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
