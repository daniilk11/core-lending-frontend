import React from "react";

const DetailsModal = ({name, handleAmountChange, asset, amount}) => {
    return (
        <div className="space-y-4">
            <h4 className="font-medium text-lg text-[#c8b6ff]">Details</h4>
            <div className="flex items-center justify-between">
                <span>Use as collateral</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={useAsCollateral} onChange={handleCollateralToggle}
                           className="sr-only peer"/>
                    <div
                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c8b6ff]"></div>
                </label>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Amount Supplied</span>
                    <span>{amount} {market.asset}</span>
                </div>
                <div className="flex justify-between">
                    <span>LTV</span>
                    <span>{market.ltv}</span>
                </div>
                <div className="flex justify-between">
                    <span>Increase in Borrow Limit</span>
                    {/*<span>+${calculateBorrowLimit()}</span>*/}
                </div>
                <div className="flex justify-between">
                    <span>Supply APY</span>
                    <span>{market?.supplyApy || 0}%</span>
                </div>
            </div>
        </div>
    );
};

export default DetailsModal;
