import React from 'react';
import PropTypes from 'prop-types';
import OverallPosition from './OverallPosition';
import PositionsTable from './PositionsTable';

export default function DashboardContent({ processedData, onViewDetails }) {
    const { userPositions, overallPosition } = processedData;

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white text-purple-900">
            <main className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-purple-800 mb-8">Your Dashboard</h1>
                <OverallPosition {...overallPosition} />
                <PositionsTable
                    userPositions={userPositions}
                    onViewDetails={onViewDetails}
                />
            </main>
        </div>
    );
}

DashboardContent.propTypes = {
    processedData: PropTypes.shape({
        userPositions: PropTypes.object,
        overallPosition: PropTypes.object,
        marketsData: PropTypes.object
    }).isRequired,
    onViewDetails: PropTypes.func.isRequired
}; 