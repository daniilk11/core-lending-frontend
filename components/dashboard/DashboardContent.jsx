import React from 'react';
import OverallPosition from './OverallPosition';
import PositionsTable from './PositionsTable';

/**
 * Main content component for the Dashboard page
 * Displays user's overall position and individual asset positions
 * @param {Object} props - Component props
 * @param {Object} props.processedData - Processed blockchain data
 * @param {Object} props.processedData.userPositions - User's individual asset positions
 * @param {Object} props.processedData.overallPosition - User's overall position metrics
 * @param {Function} props.onViewDetails - Callback function to handle viewing asset details
 * @returns {React.ReactElement} Dashboard content component
 */
export default function DashboardContent({ processedData, onViewDetails }) {
    const { userPositions, overallPosition } = processedData;

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white text-purple-900">
            <main className="container mx-auto p-6">
                {/* Page Header */}
                <h1 className="text-3xl font-bold text-purple-800 mb-8">Your Dashboard</h1>
                {/* Overall Position Section */}
                <OverallPosition {...overallPosition} />
                {/* Individual Positions Table */}
                <PositionsTable
                    userPositions={userPositions}
                    onViewDetails={onViewDetails}
                />
            </main>
        </div>
    );
}