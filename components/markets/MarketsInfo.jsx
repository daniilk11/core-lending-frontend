import React from "react";
import MarketCard from "./MarketCard";

/**
 * Component for displaying overview information about all markets
 * @param {Object} props - Component props
 * @param {Object} props.marketsOverView - Object containing market overview statistics
 * @param {string} props.marketsOverView.marketsSize - Total size of all markets
 * @param {string} props.marketsOverView.allSuppliedAssetsValue - Total value of all supplied assets
 * @param {string} props.marketsOverView.allBorrowedAssetsValue - Total value of all borrowed assets
 * @param {string} props.marketsOverView.allReservedAssetsValue - Total value of all reserved assets
 * @returns {React.ReactElement} Markets overview component
 */
const MarketsInfo = ({ marketsOverView }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
    {/* Market Size Card */}
    <MarketCard title="Markets Size" value={marketsOverView.marketsSize} />
    {/* Total Supply Card */}
    <MarketCard
      title="Total Supply"
      value={marketsOverView.allSuppliedAssetsValue}
    />
    {/* Total Borrow Card */}
    <MarketCard
      title="Total Borrow"
      value={marketsOverView.allBorrowedAssetsValue}
    />
    {/* Reserve Card */}
    <MarketCard
      title="Reserve"
      value={marketsOverView.allReservedAssetsValue}
    />
  </div>
);

export default MarketsInfo;
