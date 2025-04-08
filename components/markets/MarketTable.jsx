import React, { useEffect, useState } from "react";
import MarketRow from "./MarketRow";

/**
 * Component for displaying a table of lending markets
 * @param {Object} props - Component props
 * @param {Array<Object>} props.markets - Array of market objects containing lending market information
 * @param {Function} props.handleViewDetails - Callback function to handle viewing market details
 * @returns {React.ReactElement} Market table component
 */
const MarketTable = ({ markets, handleViewDetails }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        {/* Table Header */}
        <thead className="bg-purple-100">
          <tr>
            <th className="text-left p-3 w-1/4 font-semibold">Asset</th>
            <th className="text-left p-3 font-semibold">LTV</th>
            <th className="text-left p-3 font-semibold">Supply APR</th>
            <th className="text-left p-3 font-semibold">Total Supply</th>
            <th className="text-left p-3 font-semibold">Borrow APR</th>
            <th className="text-left p-3 font-semibold">Total Borrowed</th>
            <th className="text-left p-3 font-semibold"></th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {markets.map((market, index) => (
            <MarketRow
              key={index}
              market={market}
              onViewDetails={handleViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketTable;
