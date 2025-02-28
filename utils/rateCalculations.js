//  TODO
const multiplier = 0.2; // Multiplier before kink
const kink = 0.8; // Kink point at 80% utilization
const jumpMultiplier = 1.0; // Multiplier after kink

// const blocksPerYear = 2102400; // Number of blocks in a year (Ethereum) 4150000
// const ratePerBlock = calculateRatePerBlock(borrowRate, blocksPerYear);


export function calculateBorrowRate(utilizationRate, baseRate, multiplier, kink, jumpMultiplier) {
    return baseRate + utilizationRate * multiplier;
}

export function calculateSupplyRate(borrowRate, utilizationRate, reserveFactor) {
    return borrowRate * utilizationRate * (1 - reserveFactor);
}

export function calculateRatePerBlock(annualRate, blocksPerYear) {
    return Math.log(1 + annualRate) / blocksPerYear;
}


// export function calculateBorrowApr(market, multiplier, kink, jumpMultiplier) {
export function calculateBorrowApr(market) {
    const utilizationRate = market.totalCollateral !== 0 ? 0 : market.totalBorrows / market.totalSupply;
    return calculateBorrowRate(utilizationRate, market.baseRate, multiplier, kink, jumpMultiplier) * 100;
}

// export function calculateSupplyApr(market, multiplier, kink, jumpMultiplier) {
export function calculateSupplyApr(market) {
    const utilizationRate = market.totalCollateral !== 0 ? 0 : market.totalBorrows / market.totalSupply;
    const borrowRate = calculateBorrowRate(utilizationRate, market.baseRate, multiplier, kink, jumpMultiplier);
    return calculateSupplyRate(borrowRate, utilizationRate, market.reserveFactor) * 100;
}
