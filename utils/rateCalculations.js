// const blocksPerYear = 2102400; // Number of blocks in a year (Ethereum) 4150000
// const ratePerBlock = calculateRatePerBlock(borrowRate, blocksPerYear);

// Constants for rate calculations (as floats, matching contract values)
/** Base rate per block representing ~1% APY */
const BASE_RATE_PER_BLOCK = 826282390 / 1e18; // ~0.000000826 (1% APY base)
/** Multiplier per block representing ~10% APY at full utilization */
const MULTIPLIER_PER_BLOCK = 8262823902 / 1e18; // ~0.000008262 (10% APY at full utilization)
/** Number of blocks in a year */
const BLOCKS_PER_YEAR = 12102400;

/** Reserve factor representing the percentage of interest taken as protocol fee */
const RESERVE_FACTOR = 0.1; // 10%
/** Staking APY for protocol token stakers */
const STAKING_APY = 0.05; // 5% (adjust as needed)

/**
 * Calculates the borrow rate per block based on utilization rate
 * @param {number} utilizationRate - Current utilization rate of the market (0-1)
 * @param {number} [baseRate=BASE_RATE_PER_BLOCK] - Base rate per block
 * @param {number} [multiplier=MULTIPLIER_PER_BLOCK] - Rate multiplier per block
 * @returns {number} Borrow rate per block
 */
export function calculateBorrowRate(utilizationRate, baseRate = BASE_RATE_PER_BLOCK, multiplier = MULTIPLIER_PER_BLOCK) {
    return baseRate + utilizationRate * multiplier;
}

/**
 * Calculates the Borrow APR as a percentage for a given market
 * @param {Object} market - Market object containing supply and borrow information
 * @param {number} market.totalSupplyUnderlying - Total supply in the market
 * @param {number} market.totalBorrows - Total amount borrowed in the market
 * @returns {number} Borrow APR as a percentage, rounded to 2 decimal places
 */
export function calculateBorrowApr(market) {
    const utilizationRate = market.totalSupplyUnderlying === 0 ? 0 : market.totalBorrows / market.totalSupplyUnderlying;
    const borrowRatePerBlock = calculateBorrowRate(utilizationRate);
    const borrowAPR = borrowRatePerBlock * BLOCKS_PER_YEAR * 100; // Convert to percentage
    return Number(borrowAPR.toFixed(2));
}