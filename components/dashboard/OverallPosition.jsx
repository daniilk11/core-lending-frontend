"use client";

import React from "react";

/**
 * Formats small numbers to ensure consistent display
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
const formatSmallNumber = (value) => {
  return value < 0.0000001 ? "0.0000001" : value.toFixed(6);
};

/**
 * Component displaying user's overall lending position metrics
 * Shows supplied amount, borrowed amount, total rewards, and health factor
 * @param {Object} props - Component props
 * @param {number} props.supplied - Total amount supplied in USD
 * @param {number} props.borrowed - Total amount borrowed in USD
 * @param {number} props.totalRewards - Total rewards earned in USD
 * @param {number} props.healthFactor - Current health factor of the position
 * @returns {React.ReactElement} Overall position component
 */
const OverallPosition = ({
  supplied,
  borrowed,
  totalRewards,
  healthFactor,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    {/* Section Header */}
    <h2 className="text-2xl font-semibold text-purple-800 mb-4">
      Overall Position
    </h2>
    {/* Metrics Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Supplied Amount */}
      <div>
        <h3 className="text-lg font-medium text-gray-700">Supplied</h3>
        <p className="text-2xl font-bold text-green-600">
          ${supplied.toFixed(2)}
        </p>
      </div>
      {/* Borrowed Amount */}
      <div>
        <h3 className="text-lg font-medium text-gray-700">Borrowed</h3>
        <p className="text-2xl font-bold text-red-600">
          ${borrowed.toFixed(2)}
        </p>
      </div>
      {/* Total Rewards */}
      <div>
        <h3 className="text-lg font-medium text-gray-700">Total Rewards</h3>
        <p className="text-2xl font-bold text-blue-600">
          ${formatSmallNumber(totalRewards)}
        </p>
      </div>
      {/* Health Factor */}
      <div>
        <h3 className="text-lg font-medium text-gray-700">Health Factor</h3>
        <p
          className={`text-2xl font-bold ${
            healthFactor >= 1.5
              ? "text-green-600"
              : healthFactor >= 1.1
              ? "text-yellow-400"
              : "text-red-600"
          }`}
        >
          {healthFactor > 99 ? "100" : healthFactor}
        </p>
      </div>
    </div>
    {/* Liquidation Warning */}
    {healthFactor < 1.2 && (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600 flex items-center">
          <span className="mr-2">⚠️</span>
          Warning: Your position is at risk of liquidation. Please repay debt or
          supply more collateral to increase your health factor.
        </p>
      </div>
    )}
  </div>
);

export default OverallPosition;
