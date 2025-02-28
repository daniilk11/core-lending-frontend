import { formatUnits } from "viem";
import { initialMarketsData } from "../config/config";
import { calculateBorrowApr, calculateSupplyApr } from "./rateCalculations";

export function isValidNumber(num) {
    return typeof num === 'bigint';
}

export function formatBigInt(bigInt, decimals = 18, precision = 2) {
    if (bigInt === undefined || bigInt === null) {
        return '0.00'; // or any default value you prefer
    }
    return Number(formatUnits(bigInt, decimals)).toFixed(precision);
}

// to our initial static market data we are adding new data from blockchain
const ITEMS_PER_MARKET = 8;
const PRICE_DECIMALS = 8;
const HEALTH_FACTOR_DECIMALS = 18;
export const formatContractDataForMarkets = (rawData) => {
    // Return default values if no data
    if (!rawData) {
        return {
            updatedMarkets: [],
            newHealthFactor: 0,
            allSuppliedAssetsValue: 0,
            allBorrowedAssetsValue: 0
        };
    }
    let allSuppliedAssetsValue = 0;
    let allBorrowedAssetsValue = 0;

    const updatedMarkets = initialMarketsData.map((market, index) => {
        const offset = index * ITEMS_PER_MARKET;
        const totalSupply = formatBigInt(rawData[offset].result);
        const totalBorrows = formatBigInt(rawData[offset + 1].result);
        const exchangeRate = formatBigInt(rawData[offset + 2].result);
        const price = formatBigInt(rawData[offset + 3].result, PRICE_DECIMALS); // For decimals check chain link
        allSuppliedAssetsValue += totalSupply * price;
        allBorrowedAssetsValue += totalBorrows * price;

        return {
            ...market,
            totalSupply,
            totalBorrows,
            exchangeRate,
            price,
            cTokenAddress: rawData[offset + 4].result,
            totalCollateral: formatBigInt(rawData[offset + 5].result),
            supplyApy: calculateSupplyApr(market),
            borrowApy: calculateBorrowApr(market),
        };
    });


    // Update account information TODO to dash board
    // const [borrowedValue, collateralValue] = rawData[10].result;
    // setAccountInfo({
    //     borrowedValue: Number(formatUnits(borrowedValue, 18)),
    //     collateralValue: Number(formatUnits(collateralValue, 18)),
    // });
    return { updatedMarkets, newHealthFactor: Number(formatUnits(rawData[11].result, HEALTH_FACTOR_DECIMALS)), allSuppliedAssetsValue, allBorrowedAssetsValue }
}

// to our initial static market data we are adding new data from blockchain
export const formatContractDataForDashboard = (rawData) => {
    // Return default values if no data
    if (!rawData) {
        return {
            userPositions: {},
            overallPosition: {
                supplied: 0,
                borrowed: 0,
                availableToBorrow: 0,
                healthFactor: 0
            }
        };
    }
    const userPositions = {};
    let totalSupplied = 0;
    let totalBorrowed = 0;

    initialMarketsData.forEach((market, index) => {
        const offset = index * ITEMS_PER_MARKET;
        const [totalSupply, totalBorrows, exchangeRate] = rawData.slice(offset, offset + 3);
        const usdValue = Number(formatUnits(rawData[offset + 3].result, PRICE_DECIMALS));
        const cTokenAddress = rawData[offset + 4].result;
        const totalCollateral = rawData[offset + 5].result;
        const supplied = Number(formatUnits(rawData[offset + 6]?.result, 18) || 0);
        const borrowed = Number(formatUnits(rawData[offset + 7]?.result, 18) || 0);

        totalSupplied += supplied * usdValue;
        totalBorrowed += borrowed * usdValue;
        // TODO fix check supplied data for user
        userPositions[market.asset] = {
            supplied,
            borrowed,
            usdValue,
            apy: 0,
        };
    });

    const accountInfo = rawData[rawData.length - 2].result;
    const healthFactor = rawData[rawData.length - 1].result;
    // here todo reformat calculation cause ltv is different and price in usd is not accurate
    const howMuchCanBorrow = formatUnits(accountInfo[1], 18) * 0.75

    const overallPosition = {
        supplied: totalSupplied,
        borrowed: totalBorrowed,
        // todo make sum of available to borrow
        availableToBorrow: howMuchCanBorrow,
        totalRewards: 99,
        healthFactor,
    };
    return { userPositions, overallPosition };
};