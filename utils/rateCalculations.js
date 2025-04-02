// const blocksPerYear = 2102400; // Number of blocks in a year (Ethereum) 4150000
// const ratePerBlock = calculateRatePerBlock(borrowRate, blocksPerYear);

// Constants (as floats, matching contract values)
const BASE_RATE_PER_BLOCK = 826282390 / 1e18; // ~0.000000826 (1% APY base)
const MULTIPLIER_PER_BLOCK = 8262823902 / 1e18; // ~0.000008262 (10% APY at full utilization)
const BLOCKS_PER_YEAR = 12102400;

const RESERVE_FACTOR = 0.1; // 10%
const STAKING_APY = 0.05; // 5% (adjust as needed)

// Calculate borrow rate per block
export function calculateBorrowRate(utilizationRate, baseRate = BASE_RATE_PER_BLOCK, multiplier = MULTIPLIER_PER_BLOCK) {
    return baseRate + utilizationRate * multiplier;
}

// Calculate Borrow APR as percentage
export function calculateBorrowApr(market) {
    const utilizationRate = market.totalSupplyUnderlying === 0 ? 0 : market.totalBorrows / market.totalSupplyUnderlying;
    const borrowRatePerBlock = calculateBorrowRate(utilizationRate);
    const borrowAPR = borrowRatePerBlock * BLOCKS_PER_YEAR * 100; // Convert to percentage
    return Number(borrowAPR.toFixed(2));
}

// // Calculate Supply APR as percentage TODO delete this because i have contract calculation
// export function calculateSupplyApr(market) {
//     const borrowAPR = calculateBorrowApr(market) / 100; // Convert back to decimal for calculation
//     const netBorrowApr = borrowAPR * (1 - RESERVE_FACTOR);
//     const supplyApr = (netBorrowApr + STAKING_APY) * 100; // Convert to percentage
//     return Number(supplyApr.toFixed(2));
// }

export function calculateSupplyRate(borrowRate, reserveFactor) {
    return borrowRate * (1 - reserveFactor);
}

// TODO delete not need cause i have staking and have it in contract
export function calculateSupplyApr(market) {
    // const utilizationRate = market.totalSupply === 0 ? 0 : market.totalBorrows / market.totalSupply;
    // const borrowRate = calculateBorrowRate(utilizationRate, market.baseRate, market.multiplier);
    const rate = calculateSupplyRate(borrowRate, market.reserveFactor) * 100;
    return Number(rate.toFixed(2));
}