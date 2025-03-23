// const blocksPerYear = 2102400; // Number of blocks in a year (Ethereum) 4150000
// const ratePerBlock = calculateRatePerBlock(borrowRate, blocksPerYear);

export function calculateBorrowRate(utilizationRate, baseRate, multiplier) {
    return baseRate + utilizationRate * multiplier;
}

export function calculateSupplyRate(borrowRate, utilizationRate, reserveFactor) {
    return borrowRate * (1 - reserveFactor);
}

export function calculateRatePerBlock(annualRate, blocksPerYear) {
    return Math.log(1 + annualRate) / blocksPerYear;
}

export function calculateBorrowApr(market) {
    const utilizationRate = market.totalCollateral === 0 ? 0 : market.totalBorrows / market.totalSupply;
    const rate = calculateBorrowRate(utilizationRate, market.baseRate, market.multiplier) * 100;
    return Number(rate.toFixed(2));
}

export function calculateSupplyApr(market) {
    const utilizationRate = market.totalCollateral === 0 ? 0 : market.totalBorrows / market.totalSupply;
    const borrowRate = calculateBorrowRate(utilizationRate, market.baseRate, market.multiplier);
    const rate = calculateSupplyRate(borrowRate, utilizationRate, market.reserveFactor) * 100;
    return Number(rate.toFixed(2));
}