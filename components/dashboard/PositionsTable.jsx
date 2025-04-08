"use client";

import React from "react";
import Image from "next/image";
import AssetRow from "./AssetRow";
import WethLogo from "../../asserts/weth_logo.svg";
import UsdcLogo from "../../asserts/usdc_logo.svg";
import LinkLogo from "../../asserts/chainlink_logo.png";

/**
 * Map of asset logos to their respective Image components
 * @type {Object.<string, React.ComponentType<{className: string}>>}
 */
const LogoComponents = {
  WETH: ({ className }) => (
    <Image
      src={WethLogo}
      alt="WETH Logo"
      className={className}
      width={24}
      height={24}
    />
  ),
  LINK: ({ className }) => (
    <Image
      src={LinkLogo}
      alt="LINK Logo"
      className={className}
      width={24}
      height={24}
    />
  ),
  USDC: ({ className }) => (
    <Image
      src={UsdcLogo}
      alt="USDC Logo"
      className={className}
      width={24}
      height={24}
    />
  ),
};

/**
 * Table component displaying user's open lending positions
 * Shows detailed information about each asset position including supplied/borrowed amounts and APR
 * @param {Object} props - Component props
 * @param {Object.<string, Object>} props.userPositions - Map of asset positions
 * @param {Function} props.onViewDetails - Callback function to handle viewing position details
 * @returns {React.ReactElement} Positions table component
 */
const PositionsTable = ({ userPositions, onViewDetails }) => (
  <div className="flex flex-col space-y-6">
    {/* Table Header */}
    <h1 className="text-2xl font-semibold mb-4 text-left text-purple-800 dark:text-grey-200">
      Open Positions
    </h1>
    {/* Table Container */}
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        {/* Table Header Row */}
        <thead className="bg-purple-100">
          <tr>
            <th className="text-left p-3 font-semibold">Asset</th>
            <th className="text-left p-3 font-semibold">Type</th>
            <th className="text-left p-3 font-semibold">Supplied</th>
            <th className="text-left p-3 font-semibold">Borrowed</th>
            <th className="text-left p-3 font-semibold">APR</th>
            <th className="text-left p-3 font-semibold">Rewards</th>
            <th className="text-center p-3 font-semibold">Action</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {Object.entries(userPositions).map(([asset, data]) => (
            <AssetRow
              key={asset}
              asset={asset}
              usdValue={data.usdValue}
              type="Core"
              supplied={data.supplied}
              borrowed={data.borrowed}
              rewards={0}
              Logo={LogoComponents[asset]}
              apr={data.supplyAPR}
              onViewDetails={onViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PositionsTable;
