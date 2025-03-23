// config/contractCallsConfig.js
import { lendingContractAddress, lendingContractABI, cTokenABI, initialMarketsData } from './config';

// Create reusable contract call configurations
const createBaseContractCall = (address, abi, functionName, args = []) => ({
    address,
    abi,
    functionName,
    args
});

const createCTokenCall = (cTokenAddress, functionName, args = []) =>
    createBaseContractCall(cTokenAddress, cTokenABI, functionName, args);

const createLendingCall = (functionName, args = []) =>
    createBaseContractCall(lendingContractAddress, lendingContractABI, functionName, args);

// Predefined cToken functions to reduce repetition
const CTOKEN_FUNCTIONS = ['totalSupply', 'totalBorrows', 'exchangeRateStored'];

export const createContractCalls = (address, markets = initialMarketsData) => ({
    marketData: markets.map(market => ({
        cTokenData: CTOKEN_FUNCTIONS.map(functionName =>
            createCTokenCall(market.cTokenAddress, functionName)
        ),
        usdValue: createLendingCall('getUSDValue', [market.address, 1e8]),
        cTokenAddress: createLendingCall('s_tokenToCToken', [market.address]),
        totalCollateral: createBaseContractCall(
            market.address,
            cTokenABI,
            'balanceOf',
            [market.cTokenAddress]
        ),
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
});

export const flattenCalls = (contractCalls) => [
    ...contractCalls.marketData.flatMap(market => [
        ...market.cTokenData,
        market.usdValue,
        market.cTokenAddress,
        market.totalCollateral,
        market.userSupply,
        market.userBorrow,
    ]),
    contractCalls.accountInfo,
    contractCalls.healthFactor,
];