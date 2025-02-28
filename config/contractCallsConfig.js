// config/contractCallsConfig.js
import { lendingContractAddress, lendingContractABI, cTokenABI, initialMarketsData } from './config';

export const createContractCalls = (address, markets = initialMarketsData) => ({
    marketData: markets.map(market => ({
        cTokenData: ['totalSupply', 'totalBorrows', 'exchangeRateStored'].map(functionName => ({
            address: market.cTokenAddress,
            abi: cTokenABI,
            functionName,
        })),
        usdValue: {
            address: lendingContractAddress,
            abi: lendingContractABI,
            functionName: 'getUSDValue',
            args: [market.address, 1e8],
        },
        cTokenAddress: {
            address: lendingContractAddress,
            abi: lendingContractABI,
            functionName: 's_tokenToCToken',
            args: [market.address],
        },
        totalCollateral: {
            address: market.address,
            abi: cTokenABI,
            functionName: 'balanceOf',
            args: [market.cTokenAddress],
        },
        userSupply: {
            address: market.cTokenAddress,
            abi: cTokenABI,
            functionName: 'balanceOfUnderlying',
            args: [address],
        },
        userBorrow: {
            address: market.cTokenAddress,
            abi: cTokenABI,
            functionName: 'borrowBalanceCurrent',
            args: [address],
        },
    })),
    // TODO separate this data to user
    accountInfo: {
        address: lendingContractAddress,
        abi: lendingContractABI,
        functionName: 'getAccountInformation',
        args: [address],
    },
    healthFactor: {
        address: lendingContractAddress,
        abi: lendingContractABI,
        functionName: 'healthFactor',
        args: [address],
    },
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