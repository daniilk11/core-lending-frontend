import { formatUnits } from 'viem';
import { formatNumberToFixed } from './format';

/**
 * Calculates the new health factor after a withdrawal
 * @param {Object} params
 * @param {number} params.amount - Amount to withdraw in token units
 * @param {Object} params.accountInfo - Account information from contract
 * @param {Object} params.market - Market information including price and total borrows
 * @returns {number} New health factor after withdrawal
 */
export function calculateNewHealthFactor(amount, accountInfo, assetPrice, amountAction = 'increase') {
    const amountInAsset = parseFloat(amount) || 0;
    let newTotalCollateral = accountInfo.totalCollateralValue;
    if (amountAction === 'increase') {
        newTotalCollateral += amountInAsset * assetPrice
    } else
        newTotalCollateral -= amountInAsset * assetPrice;

    // If there are no borrows, health factor is maximum
    if (accountInfo.totalBorrowedValue === 0) {
        return Number.MAX_SAFE_INTEGER;
    }
    return newTotalCollateral / accountInfo.totalBorrowedValue;
}

/**
 * Calculates the maximum amount that can be withdrawn while maintaining health factor
 * @param {Object} params
 * @param {Object} params.accountInfo - Account information from contract
 * @param {Object} params.market - Market information including price
 * @param {bigint} params.userSupplied - User's supply on current market
 * @returns {number} Maximum withdrawable amount in token units
 */
export function calculateMaxWithdrawableAmount({ accountInfo, market, userSupplied }) {
    // If there are no borrows or very small, user can withdraw everything
    if (accountInfo.totalBorrowedValue < 0.01) {
        return userSupplied;
    }
    // 204849363161602
    //     73489912208
    //      1454007716

    // withdraw = collateral - borrows
    const maxWithdrawTokens = (accountInfo.totalCollateralValue - accountInfo.totalBorrowedValue) / market.price;

    // Return the minimum between the calculated max withdraw and the user's supply 
    return Math.min(Math.max(0, maxWithdrawTokens), userSupplied);
}


export function calculateMaxBorrowAmount({ accountInfo, market }) {
    // Convert USD amount to token amount
    const maxBorrowTokens = (accountInfo.totalCollateralValue - accountInfo.totalBorrowedValue) / market.price;

    return formatNumberToFixed(Math.min(Math.max(0, maxBorrowTokens), market.availableLiquidity));
}

/**
 * Checks if a withdrawal amount is valid based on health factor and limits
 * @param {Object} params
 * @param {number} params.amount - Amount to withdraw
 * @param {number} params.maxAmount - Maximum allowed withdrawal amount
 * @returns {boolean} Whether the withdrawal is valid
 */
export function isValidAmount({ amount,maxAmount }) {
    return parseFloat(amount) !== 0 &&
        parseFloat(amount) <= parseFloat(maxAmount);
}