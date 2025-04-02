import { ChevronRight } from "lucide-react";

const MarketRow = ({ market, onViewDetails }) => (
  <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
    <td className="p-3 cursor-pointer">
      <div className="font-bold text-purple-900">{market.asset}</div>
      <div className="text-sm text-purple-600">
        ${Number(market.price).toFixed(2)}
      </div>
    </td>
    <td className="p-3 cursor-pointer">{market.ltv}</td>
    <td className="p-3 cursor-pointer">{market.supplyAPR}%</td>
    <td className="p-3 cursor-pointer">
      <div className="text-sm text-purple-600">
        {market.totalSupplyUnderlying} {market.asset}
      </div>
    </td>
    <td className="p-3 cursor-pointer">{market.borrowAPR}%</td>
    <td className="p-3 cursor-pointer">
      <div className="text-sm text-purple-600">
        {market.totalBorrows} {market.asset}
      </div>
    </td>
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
