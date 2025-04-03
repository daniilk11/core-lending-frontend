import { formatNumberToFixed } from './format';

/**
 * Calculates the new health factor after a withdrawal
 * @param {Object} params
 * @param {number} params.amount - Amount to withdraw in token units
 * @param {Object} params.accountInfo - Account information from contract
 * @param {Object} params.market - Market information including price and total borrows
 * @returns {number} New health factor after withdrawal
 */
export function calculateNewHealthFactor(amount, accountInfo, assetPrice, ltv, amountAction = 'increase') {
    const amountInAsset = parseFloat(amount) || 0;
    let newTotalCollateral = accountInfo.totalCollateralValue;
    if (amountAction === 'increase') {
        newTotalCollateral += amountInAsset * assetPrice * ltv;
    } else {
        newTotalCollateral -= amountInAsset * assetPrice * ltv;
    }
    if (newTotalCollateral < 0) return 0
    if (accountInfo.totalBorrowedValue === 0) {
        accountInfo.totalBorrowedValue = 0.00000000001
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

    // withdraw = collateral - borrows
    const maxWithdrawTokens = (accountInfo.totalCollateralValue - accountInfo.totalBorrowedValue) / market.price;

    // Return the minimum between the calculated max withdraw and the user's supply 
    return Math.min(Math.max(0, maxWithdrawTokens), userSupplied);
}


export function calculateMaxBorrowAmount({ accountInfo, assetPrice, marketLiquidity}) {
    // Convert USD amount to token amount
    const maxBorrowTokens = (accountInfo.totalCollateralValue - accountInfo.totalBorrowedValue) / assetPrice;

    return formatNumberToFixed(Math.min(Math.max(0, maxBorrowTokens), marketLiquidity));
}

/**
 * Checks if a withdrawal amount is valid based on health factor and limits
 * @param {Object} params
 * @param {number} params.amount - Amount to withdraw
 * @param {number} params.maxAmount - Maximum allowed withdrawal amount
 * @returns {boolean} Whether the withdrawal is valid
 */
export function isValidAmount({ amount, maxAmount }) {
    return parseFloat(amount) !== 0 &&
        parseFloat(amount) <= parseFloat(maxAmount);
}