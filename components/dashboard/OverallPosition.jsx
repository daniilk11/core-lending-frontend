'use client'

import React from 'react';
import { formatBigInt } from '../../utils/format';

const OverallPosition = ({ supplied, borrowed, totalRewards, healthFactor }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-purple-800 mb-4">Overall Position</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <h3 className="text-lg font-medium text-gray-700">Supplied</h3>
                <p className="text-2xl font-bold text-green-600">${supplied.toFixed(2)}</p>
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-700">Borrowed</h3>
                <p className="text-2xl font-bold text-red-600">${borrowed.toFixed(2)}</p>
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-700">Total Rewards</h3>
                 <p className="text-2xl font-bold text-blue-600">${totalRewards}</p>
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-700">Health Factor</h3>
                <p className={`text-2xl font-bold ${
                    formatBigInt(healthFactor, 8) >= 1.3 ? 'text-green-600' :
                        formatBigInt(healthFactor, 8) >= 1.1 ? 'text-yellow-400' :
                            'text-red-600'
                }`}>
                    {formatBigInt(healthFactor, 8)}
                </p>
            </div>
        </div>
    </div>
);

export default OverallPosition;