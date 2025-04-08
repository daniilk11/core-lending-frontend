/**
 * @fileoverview Configuration for contract calls in the lending protocol.
 * Provides utility functions to create standardized contract call configurations
 * and manages the structure of contract interactions.
 */

// config/contractCallsConfig.js
import { lendingContractAddress, lendingContractABI, cTokenABI, initialMarketsData } from './config';

/**
 * Creates a base contract call configuration object
 * @param {string} address - The contract address to call
 * @param {Array<Object>} abi - The contract ABI
 * @param {string} functionName - The name of the function to call
 * @param {Array<any>} [args=[]] - Arguments to pass to the function
 * @returns {Object} Contract call configuration object
 */
const createBaseContractCall = (address, abi, functionName, args = []) => ({
    address,
    abi,
    functionName,
    args
});

/**
 * Creates a cToken contract call configuration
 * @param {string} cTokenAddress - The cToken contract address
 * @param {string} functionName - The name of the function to call
 * @param {Array<any>} [args=[]] - Arguments to pass to the function
 * @returns {Object} Contract call configuration object
 */
const createCTokenCall = (cTokenAddress, functionName, args = []) =>
    createBaseContractCall(cTokenAddress, cTokenABI, functionName, args);

/**
 * Creates a lending contract call configuration
 * @param {string} functionName - The name of the function to call
 * @param {Array<any>} [args=[]] - Arguments to pass to the function
 * @returns {Object} Contract call configuration object
 */
const createLendingCall = (functionName, args = []) =>
    createBaseContractCall(lendingContractAddress, lendingContractABI, functionName, args);

/**
 * List of standard cToken functions used for market data queries
 * @constant {Array<string>}
 */
const CTOKEN_FUNCTIONS = ['totalSupply', 'totalBorrows', 'exchangeRateStored', 'getSupplyAPR', 'getTotalReserves', 'getBorrowAPR'];

/**
 * Creates a complete set of contract calls for a given user address
 * @param {string} address - The user's address
 * @param {Array<Object>} [markets=initialMarketsData] - List of markets to query
 * @returns {Object} Object containing all necessary contract calls for the user
 */
export const createContractCalls = (address, markets = initialMarketsData) => ({

    marketData: markets.map(market => ({
        cTokenData: CTOKEN_FUNCTIONS.map(functionName =>
            createCTokenCall(market.cTokenAddress, functionName)
        ),

        usdValue: createLendingCall('getUSDValue', [market.address, BigInt(10) ** BigInt(market.decimals)]),

        cTokenAddress: createLendingCall('s_tokenToCToken', [market.address]),

        userSupply: createCTokenCall(
            market.cTokenAddress,
            'balanceOfUnderlying',
            [address]
        ),
        userBorrow: createCTokenCall(
            market.cTokenAddress,
            'borrowBalanceCurrent',
            [address]
        ),

    })),

    accountInfo: createLendingCall('getAccountInformation', [address]),
    healthFactor: createLendingCall('healthFactor', [address]),
    userRewards: createLendingCall('getUserRewards', [address]),
});

/**
 * Flattens the nested contract calls structure into a single array
 * @param {Object} contractCalls - The contract calls object from createContractCalls
 * @returns {Array<Object>} Flattened array of contract call configurations
 */
export const flattenCalls = (contractCalls) => [
    ...contractCalls.marketData.flatMap(market => [
        ...market.cTokenData,
        market.usdValue,
        market.cTokenAddress,
        market.userSupply,
        market.userBorrow,
    ]),
    contractCalls.accountInfo,
    contractCalls.healthFactor,
    contractCalls.userRewards,
];