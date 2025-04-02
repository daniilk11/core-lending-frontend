import React from 'react';
import MarketCard from './MarketCard';

const MarketsInfo = ({ marketsOverView }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <MarketCard title="Markets Size" value={marketsOverView.marketsSize}/>
        <MarketCard title="Total Supply" value={marketsOverView.allSuppliedAssetsValue}/>
        <MarketCard title="Total Borrow" value={marketsOverView.allBorrowedAssetsValue}/>
        <MarketCard title="Reserve" value={marketsOverView.allReservedAssetsValue} /> 
    </div>
);

export default MarketsInfo;
