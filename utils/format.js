import { formatUnits } from "viem";
import { initialMarketsData } from "../config/config";

/** Number of data items per market in the raw data array */
const ITEMS_PER_MARKET = 10;
/** Number of decimals for price values */
const PRICE_DECIMALS = 18;
/** Number of decimals for health factor values */
const HEALTH_FACTOR_DECIMALS = 10;
/** Default number of decimals for token amounts */
const DEFAULT_DECIMALS = 18;
/** Default precision for number formatting */
const DEFAULT_PRECISION = 2;



// Utility functions
/**
 * Checks if a value is a valid bigint
 * @param {unknown} num - The value to check
 * @returns {boolean} - True if the value is a bigint
 */
export function isValidNumber(num) {
    return typeof num === 'bigint';
}

/**
 * Formats a bigint value to a string with specified decimals and precision
 * @param {bigint|null|undefined} bigInt - The bigint value to format
 * @param {number} [decimals=18] - The number of decimals
 * @param {number} [precision=2] - The precision to use
 * @returns {string} - The formatted string
 */
export function formatBigInt(bigInt, decimals = DEFAULT_DECIMALS, precision = DEFAULT_PRECISION) {
    if (bigInt === undefined || bigInt === null) {
        return '0.00'; // or any default value you prefer
    }
    return Number(formatUnits(bigInt, decimals)).toFixed(precision);
}

/**
 * Formats a number to a fixed number of decimal places
 * @param {number|string} value - The value to format
 * @param {number} [decimals=9] - The number of decimal places
 * @returns {string} - The formatted string
 */
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

/**
 * Calculates the USD price for an amount and price
 * @param {number|string} amount - The amount
 * @param {number|string} price - The price
 * @param {number} [decimals=2] - The number of decimal places
 * @returns {string} - The calculated USD price
 */
export function calculateUSDPrice(amount, price, decimals = 2) {
    const parsedAmount = parseFloat(amount);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedAmount) || isNaN(parsedPrice)) {
        return '0.00';
    }

    return (parsedAmount * parsedPrice).toFixed(decimals);
}

// Helper functions for data processing
/**
 * Extracts market data from raw data
 * @param {RawDataItem[]} rawData - The raw data
 * @param {Market} market - The market
 * @param {number} index - The index
 * @returns {Market} - The processed market
 */
function extractMarketData(rawData, market, index) {
    const offset = index * ITEMS_PER_MARKET;

    return {
        ...market,
        totalSupply: formatBigInt(rawData[offset]?.result, market.decimals, 5),
        totalBorrows: Number(formatBigInt(rawData[offset + 1]?.result, market.decimals, 5)),
        totalReserve: formatBigInt(rawData[offset + 4]?.result, market.decimals, 5),
        supplyAPR: formatBigInt(rawData[offset + 3]?.result, 16),
        borrowAPR: formatBigInt(rawData[offset + 5]?.result, 16),
        exchangeRate: Number(formatBigInt(rawData[offset + 2]?.result)),
        price: Number(formatBigInt(rawData[offset + 6]?.result, PRICE_DECIMALS)),
        cTokenAddress: rawData[offset + 7]?.result,
        userSupplied: Number(formatUnits(rawData[offset + 8]?.result || BigInt(0), market.decimals)),
        userBorrowed: Number(formatUnits(rawData[offset + 9]?.result || BigInt(0), market.decimals)),
    };
}

/**
 * Calculates market metrics
 * @param {Market} market - The market
 * @returns {Market} - The market with calculated metrics
 */
function calculateMarketMetrics(market) {
    // Total Supply in underlying tokens
    market.totalSupplyUnderlying = Number(market.totalSupply) * market.exchangeRate;

    // Available liquidity for borrowing and withdrawing
    market.availableLiquidity = market.totalSupplyUnderlying - market.totalBorrows - Number(market.totalReserve);

    return market;
}

/**
 * Calculates market values
 * @param {Market} market - The market
 * @returns {{ suppliedValue: number, borrowedValue: number, reservedValue: number }} - The calculated values
 */
function calculateMarketValues(market) {
    return {
        suppliedValue: market.totalSupplyUnderlying * market.price,
        borrowedValue: market.totalBorrows * market.price,
        reservedValue: Number(market.totalReserve) * market.price,
    };
}

/**
 * Extracts account info from raw data
 * @param {RawDataItem[]} rawData - The raw data
 * @returns {AccountInfo} - The account info
 */
function extractAccountInfo(rawData) {
    const accountData = rawData[rawData.length - 3]?.result || [BigInt(0), BigInt(0)];

    return {
        totalCollateralValue: Number(formatUnits(accountData[1], 18)),
        totalBorrowedValue: Number(formatUnits(accountData[0], 18)),
        totalUserRewards: Number(formatUnits(rawData[rawData.length - 1]?.result || BigInt(0), 18)),
    };
}

// Main export functions
/**
 * Formats contract data for markets
 * @param {RawDataItem[]|null} rawData - The raw data
 * @returns {Object} - The formatted data
 */
export function formatContractDataForMarkets(rawData) {
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
        if (market.userBorrowed || market.userSupplied) {
            userPositions[market.asset] = {
                supplied: market.userSupplied,
                borrowed: market.userBorrowed,
                price,
                supplyAPR: market.supplyAPR,
                borrowAPR: market.borrowAPR,
            };
        }

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