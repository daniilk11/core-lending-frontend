import React from 'react';
import PropTypes from 'prop-types';
import MarketTable from './MarketTable';
import MarketsInfo from "./MarketsInfo";
import MarketsHeader from "./MarketsHeader";

/**
 * Main content component for the Markets page
 * @param {Object} props - Component props
 * @param {Array<Object>} props.markets - Array of market objects containing lending market information
 * @param {Object} props.marketsOverView - Object containing market overview statistics
 * @param {Function} props.onViewDetails - Callback function to handle viewing market details
 * @returns {React.ReactElement} Markets content component
 */
export default function MarketsContent({ markets, marketsOverView, onViewDetails }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white text-purple-900">
            <div className="container mx-auto p-6">
                {/* Page Header */}
                <MarketsHeader />
                {/* Markets Overview Section */}
                <MarketsInfo marketsOverView={marketsOverView} />
                {/* Markets Table Section */}
                <MarketTable
                    markets={markets}
                    handleViewDetails={onViewDetails}
                />
            </div>
        </div>
    );
}

// PropTypes validation
MarketsContent.propTypes = {
    markets: PropTypes.array.isRequired,
    marketsOverView: PropTypes.shape({
        totalSupplied: PropTypes.number,
        totalBorrowed: PropTypes.number
    }).isRequired,
    onViewDetails: PropTypes.func.isRequired
};