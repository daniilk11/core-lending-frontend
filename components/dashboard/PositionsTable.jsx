"use client";

import React from "react";
import Image from "next/image";
import AssetRow from "./AssetRow";
import WethLogo from "../../asserts/weth_logo.svg";
import UsdcLogo from "../../asserts/usdc_logo.svg";
import LinkLogo from "../../asserts/chainlink_logo.png";

// Create components for each logo
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
    // todo fix logo
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

const PositionsTable = ({ userPositions, onViewDetails }) => (
  <div className="flex flex-col space-y-6">
    <h1 className="text-2xl font-semibold mb-4 text-left text-purple-800 dark:text-grey-200">
      Open Positions
    </h1>
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
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
