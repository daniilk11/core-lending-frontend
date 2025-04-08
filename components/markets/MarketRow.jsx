import { ChevronRight } from "lucide-react";

/**
 * Component for displaying a single market row in the markets table
 * @param {Object} props - Component props
 * @param {Object} props.market - Market object containing lending market information
 * @param {Function} props.onViewDetails - Callback function to handle viewing market details
 * @returns {React.ReactElement} Market row component
 */
const MarketRow = ({ market, onViewDetails }) => (
  <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
    {/* Asset and Price Column */}
    <td className="p-3 cursor-pointer">
      <div className="font-bold text-purple-900">{market.asset}</div>
      <div className="text-sm text-purple-600">
        ${Number(market.price).toFixed(2)}
      </div>
    </td>
    {/* LTV Column */}
    <td className="p-3 cursor-pointer">{market.ltv}</td>
    {/* Supply APR Column */}
    <td className="p-3 cursor-pointer">{market.supplyAPR}%</td>
    {/* Total Supply Column */}
    <td className="p-3 cursor-pointer">
      <div className="text-sm text-purple-600">
        {market.totalSupplyUnderlying} {market.asset}
      </div>
    </td>
    {/* Borrow APR Column */}
    <td className="p-3 cursor-pointer">{market.borrowAPR}%</td>
    {/* Total Borrowed Column */}
    <td className="p-3 cursor-pointer">
      <div className="text-sm text-purple-600">
        {market.totalBorrows} {market.asset}
      </div>
    </td>
    {/* View Details Button Column */}
    <td className="p-3">
      <button
        onClick={() => onViewDetails(market)}
        className="text-purple-500 hover:text-purple-700 flex items-center"
      >
        View details
        <ChevronRight size={38} className="ml-1" />
      </button>
    </td>
  </tr>
);

export default MarketRow;
