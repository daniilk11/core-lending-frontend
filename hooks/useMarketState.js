import { useState } from 'react';
import { initialMarketsData } from "../config/config";

export const useMarketState = () => {
    const [markets, setMarkets] = useState(initialMarketsData);
    const [marketsOverView, setMarketsOverView] = useState({
        allSuppliedAssetsValue: 0,
        allBorrowedAssetsValue: 0,
        marketsSize: 0,
    });

    const updateAssetValues = (supplied, borrowed) => {
        setMarketsOverView({
            allSuppliedAssetsValue: supplied,
            allBorrowedAssetsValue: borrowed,
            marketsSize: supplied + borrowed,
        });
    };

    return { markets, setMarkets, marketsOverView, updateAssetValues };
};
