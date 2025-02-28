import React from "react";

const MarketCard = ({title, value}) => (
    <div className="bg-purple-50 p-4 rounded shadow-sm">
        <h2 className="font-semibold text-purple-700">{title}</h2>
        <p className="text-2xl font-bold text-purple-900">${value.toLocaleString()}</p>
    </div>
);

export default MarketCard;