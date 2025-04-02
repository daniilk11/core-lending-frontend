import React from 'react';

const DetailsSection = ({ 
    title = "Details",
    showCollateral = false,
    details = [],
}) => {
    return (
        <div className="space-y-4">
            <h4 className="font-medium text-lg text-[#c8b6ff]">{title}</h4>
            
            {/* TODO delete {showCollateral && (
                <div className="flex items-center justify-between">
                    <span>Use as collateral</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={useAsCollateral} 
                            onChange={onCollateralToggle}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c8b6ff]"></div>
                    </label>
                </div>
            )} */}

            <div className="space-y-2 text-sm">
                {details.map((detail, index) => (
                    <div key={index} className="flex justify-between">
                        <span>{detail.label}</span>
                        <span>{detail.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailsSection; 