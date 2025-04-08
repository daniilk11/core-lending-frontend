import { formatUnits } from "viem";
import { initialMarketsData, FORMAT_CONSTANTS } from "../config/config";

// Destructure constants for easier access
const {
    ITEMS_PER_MARKET,
    PRICE_DECIMALS,
    HEALTH_FACTOR_DECIMALS,
    DEFAULT_DECIMALS,
    DEFAULT_PRECISION
} = FORMAT_CONSTANTS;

// ===== Utility Functions =====

/**
 * Checks if a value is a valid bigint
 * @param {unknown} num - The value to check
 * @returns {boolean} - True if the value is a bigint
 */
export function isValidNumber(num) {
    return typeof num === 'bigint';
}

/**
 * Safely formats a bigint value to a number with specified decimals
 * @param {bigint|null|undefined} value - The bigint value to format
 * @param {number} decimals - The number of decimals
 * @returns {number} - The formatted number
 */
function safeFormatUnits(value, decimals) {
    return Number(formatUnits(value || BigInt(0), decimals));
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

// ===== Market Processing Functions =====

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
        userSupplied: safeFormatUnits(rawData[offset + 8]?.result, market.decimals),
        userBorrowed: safeFormatUnits(rawData[offset + 9]?.result, market.decimals),
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
 * Processes a single market from raw data
 * @param {Market} market - The market to process
 * @param {RawDataItem[]} rawData - The raw data
 * @param {number} index - The index of the market
 * @returns {Object} - The processed market and its values
 */
function processMarket(market, rawData, index) {
    // Extract basic market data
    const processedMarket = extractMarketData(rawData, market, index);

    // Calculate metrics
    processedMarket.totalSupplyUnderlying = Number(processedMarket.totalSupply) * processedMarket.exchangeRate;
    processedMarket.availableLiquidity = processedMarket.totalSupplyUnderlying - processedMarket.totalBorrows - Number(processedMarket.totalReserve);

    // Calculate values
    const values = calculateMarketValues(processedMarket);

    return {
        market: processedMarket,
        values
    };
}

// ===== Account Processing Functions =====

/**
 * Extracts account info from raw data
 * @param {RawDataItem[]} rawData - The raw data
 * @returns {AccountInfo} - The account info
 */
function extractAccountInfo(rawData) {
    const accountData = rawData[rawData.length - 3]?.result || [BigInt(0), BigInt(0)];

    return {
        totalCollateralValue: safeFormatUnits(accountData[1], 18),
        totalBorrowedValue: safeFormatUnits(accountData[0], 18),
        totalUserRewards: safeFormatUnits(rawData[rawData.length - 1]?.result, 18),
    };
}

/**
 * Extracts health factor from raw data
 * @param {RawDataItem[]} rawData - The raw data
 * @returns {number} - The health factor
 */
function extractHealthFactor(rawData) {
    return Number(formatUnits(rawData[rawData.length - 2]?.result || BigInt(0), HEALTH_FACTOR_DECIMALS));
}

/**
 * Calculates available borrowing capacity
 * @param {AccountInfo} accountInfo - The account info
 * @returns {number} - The available borrowing capacity
 */
function calculateAvailableBorrowing(accountInfo) {
    return accountInfo.totalCollateralValue - accountInfo.totalBorrowedValue;
}

// ===== Main Export Functions =====

/**
 * Formats contract data for markets
 * @param {RawDataItem[]|null} rawData - The raw data
 * @returns {Object} - The formatted data
 */
export function formatContractDataForMarkets(rawData) {
    if (!rawData) {
        return {
            updatedMarkets: [],
            healthFactor: 0,
            marketsOverView: {
                allSuppliedAssetsValue: 0,
                allBorrowedAssetsValue: 0,
                allReservedAssetsValue: 0,
                marketsSize: 0
            },
            accountInfo: {
                totalCollateralValue: 0,
                totalBorrowedValue: 0,
                totalUserRewards: 0
            }
        };
    }

    let allSuppliedAssetsValue = 0;
    let allBorrowedAssetsValue = 0;
    let allReservedAssetsValue = 0;

    const updatedMarkets = initialMarketsData.map((market, index) => {
        const { market: processedMarket, values } = processMarket(market, rawData, index);

        // Accumulate values
        allSuppliedAssetsValue += values.suppliedValue;
        allBorrowedAssetsValue += values.borrowedValue;
        allReservedAssetsValue += values.reservedValue;

        return processedMarket;
    });

    const marketsOverView = {
        allSuppliedAssetsValue,
        allBorrowedAssetsValue,
        allReservedAssetsValue,
        marketsSize: allSuppliedAssetsValue + allBorrowedAssetsValue,
    };

    const healthFactor = extractHealthFactor(rawData);
    const accountInfo = extractAccountInfo(rawData);

    return { updatedMarkets, healthFactor, marketsOverView, accountInfo };
}

/**
 * Formats contract data for dashboard
 * @param {RawDataItem[]|null} rawData - The raw data
 * @returns {Object} - The formatted dashboard data
 */
export function formatContractDataForDashboard(rawData) {
    // Return default values if no data
    if (!rawData) {
        return {
            userPositions: {},
            overallPosition: {
                supplied: 0,
                borrowed: 0,
                availableToBorrow: 0,
                healthFactor: 0,
                totalRewards: 0
            },
            marketsData: {},
            accountInfo: {
                totalCollateralValue: 0,
                totalBorrowedValue: 0
            }
        };
    }

    const userPositions = {};
    const marketsData = {};
    let totalSupplied = 0;
    let totalBorrowed = 0;

    initialMarketsData.forEach((market, index) => {
        const { market: processedMarket, values } = processMarket(market, rawData, index);
        const price = processedMarket.price;

        // Calculate user position values
        totalSupplied += processedMarket.userSupplied * price;
        totalBorrowed += processedMarket.userBorrowed * price;

        // Add to user positions if user has a position
        if (processedMarket.userBorrowed || processedMarket.userSupplied) {
            userPositions[processedMarket.asset] = {
                supplied: processedMarket.userSupplied,
                borrowed: processedMarket.userBorrowed,
                price,
                supplyAPR: processedMarket.supplyAPR,
                borrowAPR: processedMarket.borrowAPR,
            };
        }

        // Add to markets data
        marketsData[processedMarket.asset] = {
            ...processedMarket,
            price,
        };
    });

    const accountInfo = {
        totalCollateralValue: safeFormatUnits(rawData[rawData.length - 3].result[1], 18),
        totalBorrowedValue: safeFormatUnits(rawData[rawData.length - 3].result[0], 18),
    };

    const healthFactor = extractHealthFactor(rawData);
    const howMuchCanBorrow = calculateAvailableBorrowing(accountInfo);
    const totalRewards = safeFormatUnits(rawData[rawData.length - 1].result, 18);

    const overallPosition = {
        supplied: totalSupplied,
        borrowed: totalBorrowed,
        availableToBorrow: howMuchCanBorrow,
        totalRewards,
        healthFactor,
    };

    return { userPositions, overallPosition, marketsData, accountInfo };
};