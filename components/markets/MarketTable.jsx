import React, {useEffect, useState} from 'react';
import MarketRow from "./MarketRow";

const MarketTable = ({markets, handleViewDetails}) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
                <thead className="bg-purple-100">
                <tr>
                    <th className="text-left p-3 w-1/4 font-semibold">Asset</th>
                    <th className="text-left p-3 font-semibold">LTV</th>
                    <th className="text-left p-3 font-semibold">Supply APY</th>
                    <th className="text-left p-3 font-semibold">Total Supply</th>
                    <th className="text-left p-3 font-semibold">Borrow APY</th>
                    <th className="text-left p-3 font-semibold">Total Borrowed</th>
                    <th className="text-left p-3 font-semibold"></th>
                </tr>
                </thead>
                <tbody>
                {markets.map((market, index) => (
                    <MarketRow key={index} market={market} onViewDetails={handleViewDetails}/>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MarketTable;