import { formatNumberToFixed } from './format';

/**
 * Calculates the new health factor after a withdrawal or deposit
 * @param {number} amount - Amount to withdraw/deposit in token units
 * @param {Object} accountInfo - Account information from contract
 * @param {number} accountInfo.totalCollateralValue - Total collateral value in USD
 * @param {number} accountInfo.totalBorrowedValue - Total borrowed value in USD
 * @param {number} assetPrice - Price of the asset in USD
 * @param {number} ltv - Loan to value ratio for the asset
 * @param {string} [amountAction='increase'] - Action to perform ('increase' or 'decrease')
 * @returns {number} New health factor after the action
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
 * @param {Object} params - Parameters object
 * @param {Object} params.accountInfo - Account information from contract
 * @param {number} params.accountInfo.totalCollateralValue - Total collateral value in USD
 * @param {number} params.accountInfo.totalBorrowedValue - Total borrowed value in USD
 * @param {Object} params.market - Market information
 * @param {number} params.market.price - Price of the asset in USD
 * @param {number} params.userSupplied - User's supply on current market
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

/**
 * Calculates the maximum amount that can be borrowed based on collateral and market liquidity
 * @param {Object} params - Parameters object
 * @param {Object} params.accountInfo - Account information from contract
 * @param {number} params.accountInfo.totalCollateralValue - Total collateral value in USD
 * @param {number} params.accountInfo.totalBorrowedValue - Total borrowed value in USD
 * @param {number} params.assetPrice - Price of the asset in USD
 * @param {number} params.marketLiquidity - Available liquidity in the market
 * @returns {string} Maximum borrowable amount in token units, formatted to fixed precision
 */
export function calculateMaxBorrowAmount({ accountInfo, assetPrice, marketLiquidity }) {
    // Convert USD amount to token amount
    const maxBorrowTokens = (accountInfo.totalCollateralValue - accountInfo.totalBorrowedValue) / assetPrice;

    return formatNumberToFixed(Math.min(Math.max(0, maxBorrowTokens), marketLiquidity));
}

/**
 * Checks if a withdrawal amount is valid based on health factor and limits
 * @param {Object} params - Parameters object
 * @param {number|string} params.amount - Amount to withdraw
 * @param {number|string} params.maxAmount - Maximum allowed withdrawal amount
 * @returns {boolean} Whether the withdrawal is valid
 */
export function isValidAmount({ amount, maxAmount }) {
    return parseFloat(amount) !== 0 &&
        parseFloat(amount) <= parseFloat(maxAmount);
}