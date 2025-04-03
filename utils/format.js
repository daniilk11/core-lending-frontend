import { formatUnits } from "viem";
import { initialMarketsData } from "../config/config";

export function isValidNumber(num) {
    return typeof num === 'bigint';
}

export function formatBigInt(bigInt, decimals = 18, precision = 2) {
    if (bigInt === undefined || bigInt === null) {
        return '0.00'; // or any default value you prefer
    }
    return Number(formatUnits(bigInt, decimals)).toFixed(precision);
}

export function formatNumberToFixed(value, decimals = 9) {
    // Convert scientific notation or string to number
    const num = Number(value);

    // Handle invalid inputs
    if (isNaN(num)) return '0';

    // Use toFixed to get exact decimal places and prevent scientific notation
    const fixed = num.toFixed(decimals);

    // Remove trailing zeros after decimal point, but keep at least one zero after decimal
    return fixed.replace(/\.?0+$/, '') || '0';
}

export function calculateUSDPrice(amount, price, decimals = 2) {
    const parsedAmount = parseFloat(amount);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedAmount) || isNaN(parsedPrice)) {
        return '0.00';
    }

    return (parsedAmount * parsedPrice).toFixed(decimals);
}

// to our initial static market data we are adding new data from blockchain  todo to config
const ITEMS_PER_MARKET = 10; // todo check errs  when 2 markets
const PRICE_DECIMALS = 18;
const HEALTH_FACTOR_DECIMALS = 10;

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
    let allReservedAssetsValue = 0;

    const updatedMarkets = initialMarketsData.map((market, index) => {
        const offset = index * ITEMS_PER_MARKET;

        market.totalSupply = formatBigInt(rawData[offset]?.result, market.decimals, 5);
        market.totalBorrows = Number(formatBigInt(rawData[offset + 1]?.result, market.decimals, 5));
        market.totalReserve = formatBigInt(rawData[offset + 4]?.result, market.decimals, 5);

        market.supplyAPR = formatBigInt(rawData[offset + 3]?.result, 16);
        market.borrowAPR = formatBigInt(rawData[offset + 5]?.result, 16);

        market.exchangeRate = Number(formatBigInt(rawData[offset + 2]?.result));
        market.price = Number(formatBigInt(rawData[offset + 6]?.result, PRICE_DECIMALS));
        market.cTokenAddress = rawData[offset + 7]?.result;
        market.userSupplied = Number(formatUnits(rawData[offset + 8]?.result || BigInt(0), market.decimals));
        market.userBorrowed = Number(formatUnits(rawData[offset + 9]?.result || BigInt(0), market.decimals));

        // Total Supply in underlying tokens
        market.totalSupplyUnderlying = market.totalSupply * market.exchangeRate;

        // in underlying tokens used in how much max can borrow and withdraw  
        market.availableLiquidity = market.totalSupplyUnderlying - market.totalBorrows - market.totalReserve;

        allSuppliedAssetsValue += market.totalSupplyUnderlying * market.price;
        allBorrowedAssetsValue += market.totalBorrows * market.price;
        allReservedAssetsValue += market.totalReserve * market.price;

        return {
            ...market,
        };
    });
    const marketsOverView = {
        allSuppliedAssetsValue: allSuppliedAssetsValue,
        allBorrowedAssetsValue: allBorrowedAssetsValue,
        allReservedAssetsValue: allReservedAssetsValue,
        marketsSize: allSuppliedAssetsValue + allBorrowedAssetsValue,
    };
    const healthFactor = Number(formatUnits(rawData[rawData.length - 2]?.result || BigInt(0), HEALTH_FACTOR_DECIMALS));
    const accountInfo = {
        totalCollateralValue: Number(formatUnits(rawData[rawData.length - 3]?.result?.[1] || BigInt(0), 18)),
        totalBorrowedValue: Number(formatUnits(rawData[rawData.length - 3]?.result?.[0] || BigInt(0), 18)),
        totalUserRewards: Number(formatUnits(rawData[rawData.length - 1]?.result || BigInt(0), 18)),
    };

    return { updatedMarkets, healthFactor, marketsOverView, accountInfo }
}


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
    const marketsData = {};
    let totalSupplied = 0;
    let totalBorrowed = 0;

    initialMarketsData.forEach((market, index) => {
        const offset = index * ITEMS_PER_MARKET;

        market.totalSupply = Number(formatBigInt(rawData[offset].result, market.decimals, 5));
        market.totalBorrows = Number(formatBigInt(rawData[offset + 1].result, market.decimals, 5));
        market.totalReserve = formatBigInt(rawData[offset + 4].result, market.decimals, 5);

        market.supplyAPR = formatBigInt(rawData[offset + 3].result, 16);
        market.borrowAPR = formatBigInt(rawData[offset + 5].result, 16);

        market.exchangeRate = Number(formatBigInt(rawData[offset + 2].result));
        const price = Number(formatBigInt(rawData[offset + 6].result, PRICE_DECIMALS));
        market.cTokenAddress = rawData[offset + 7].result;
        market.userSupplied = Number(formatUnits(rawData[offset + 8]?.result, market.decimals) || 0);
        market.userBorrowed = Number(formatUnits(rawData[offset + 9]?.result, market.decimals) || 0);

        // Total Supply in underlying tokens
        market.totalSupplyUnderlying = market.totalSupply * market.exchangeRate;

        // in underlying tokens used in how much max can borrow and withdraw  
        market.availableLiquidity = market.totalSupplyUnderlying - market.totalBorrows - market.totalReserve;

        totalSupplied += market.userSupplied * price;
        totalBorrowed += market.userBorrowed * price;

        userPositions[market.asset] = {
            supplied: market.userSupplied,
            borrowed: market.userBorrowed,
            price,
            supplyAPR: market.supplyAPR,
            borrowAPR: market.borrowAPR,
        };

        marketsData[market.asset] = {
            ...market,
            price,
        };
    });
    const accountInfo = {
        totalCollateralValue: Number(formatUnits(rawData[rawData.length - 3].result[1], 18)),
        totalBorrowedValue: Number(formatUnits(rawData[rawData.length - 3].result[0], 18)),
    };
    const healthFactor = Number(formatBigInt(rawData[rawData.length - 2].result, HEALTH_FACTOR_DECIMALS));

    const howMuchCanBorrow = accountInfo.totalCollateralValue - accountInfo.totalBorrowedValue;

    const totalRewards = Number(formatUnits(rawData[rawData.length - 1].result, 18));

    const overallPosition = {
        supplied: totalSupplied,
        borrowed: totalBorrowed,
        availableToBorrow: howMuchCanBorrow,
        totalRewards,
        healthFactor,
    };
    return { userPositions, overallPosition, marketsData, accountInfo };
};