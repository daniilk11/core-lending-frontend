import React from 'react';
import PropTypes from 'prop-types';
import MarketTable from './MarketTable';
import MarketsInfo from "./MarketsInfo";
import MarketsHeader from "./MarketsHeader";

export default function MarketsContent({ markets, marketsOverView, onViewDetails }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white text-purple-900">
            <div className="container mx-auto p-6">
                <MarketsHeader />
                <MarketsInfo marketsOverView={marketsOverView} />
                <MarketTable
                    markets={markets}
                    handleViewDetails={onViewDetails}
                />
            </div>
        </div>
    );
}

MarketsContent.propTypes = {
    markets: PropTypes.array.isRequired,
    marketsOverView: PropTypes.shape({
        totalSupplied: PropTypes.number,
        totalBorrowed: PropTypes.number
    }).isRequired,
    onViewDetails: PropTypes.func.isRequired
};