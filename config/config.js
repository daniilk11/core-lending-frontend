export const lendingContractAddress = '0xc5e0225eCBe9EA897848770DB78F8EccD0ae6F15';
export const initialMarketsData = [
    {
        asset: 'WETH',
        address: "0x4200000000000000000000000000000000000006",
        decimals: 18,
        ltv: 0.75,
        cTokenAddress: "0x11daF26e5Ac90eA5fE8Cbc50A1c1418B4F01a970",
        baseRate: 0.03,  // 5% base annual interest rate
        reserveFactor: 0.1, // 10% from borrowers payment
        price: 2000,
        totalCollateral: 0,  // Will be updated by mock data
        totalBorrows: 0,     // Will be updated by mock data
        totalSupply: 0,      // Will be updated by mock data
        exchangeRate: 0,     // Will be updated by mock data
        multiplier: 0.05, //   put weight  on  utilization
    },
    {
        asset: 'LINK',
        address: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
        ltv: 0.75,
        decimals: 18,
        cTokenAddress: "0x6cC4983A79A45e74Ad31cb8326C44eEA628E7a35",
        baseRate: 0.02,
        reserveFactor: 0.1,
        price: 17,
        totalCollateral: 0,
        totalBorrows: 0,
        totalSupply: 0,
        exchangeRate: 0,
        multiplier: 0.05,
    },
    {
        asset: 'USDC',
        address: "0xE4",
        ltv: 0.80,
        decimals: 18,
        cTokenAddress: "0x6cC49",
        baseRate: 0.04,
        reserveFactor: 0.1,
        price: 1,
        totalCollateral: 0,
        totalBorrows: 0,
        totalSupply: 0,
        exchangeRate: 0,
        multiplier: 0.05,
    }
];

// MY contracts
// lending 0xc5e0225eCBe9EA897848770DB78F8EccD0ae6F15
// cweth 0x11daF26e5Ac90eA5fE8Cbc50A1c1418B4F01a970
// SEND HERE A TOKENS FOR STAKING
// // cwethStaking 0xa415B12321b70D69de148c145E8e38ca2C2BA730 SEND HERE A TOKENS FOR STAKING
// // weeth 0x4200000000000000000000000000000000000006 
// // oracle 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1

// cLink  0x6cC4983A79A45e74Ad31cb8326C44eEA628E7a35
// cLinkStaking 0x62Ac2a043587CdbA9609b16A7Ce5168DADdEa28c
// ERC-20 0xE4aB69C077896252FAFBD49EFD26B5D171A32410 
// oracle 0xb113F5A928BCfF189C998ab20d753a47F9dE5A61 

export const contractABI = [
    {
        "inputs": [{ "internalType": "address", "name": "asset", "type": "address" }],
        "name": "getSupplyAPY",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "asset", "type": "address" }],
        "name": "getBorrowAPY",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "asset", "type": "address" }],
        "name": "getTotalBorrowed",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "asset", "type": "address" }],
        "name": "getBorrowLimit",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "asset", "type": "address" }, {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "asset", "type": "address" }, {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }], "name": "borrow", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    }
];
export const erc20ABI = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function"
    },
    {
        constant: false,
        inputs: [{ name: "_spender", type: "address" }, { name: "_value", type: "uint256" }],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        type: "function"
    },
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }, { name: "_spender", type: "address" }],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        type: "function"
    }
];

export const lendingContractABI = [
    {
        "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
        "name": "getAccountInformation",
        "outputs": [{
            "internalType": "uint256",
            "name": "borrowedValueInUSD",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "collateralValueInUSD", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
        "name": "healthFactor",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }],
        "name": "getUSDValue",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "s_tokenToCToken",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },

    {
        "inputs": [
            {
                "internalType": "contract ISwapRouter",
                "name": "_swapRouter",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "priceFeed",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "cToken",
                "type": "address"
            }
        ],
        "name": "AllowedTokenSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Borrow",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "repayToken",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "rewardToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "halfDebtInEth",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "liquidator",
                "type": "address"
            }
        ],
        "name": "Liquidate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Deposit",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Repay",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Withdraw",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "borrow",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "repay",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "cTokenAmount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "repayToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "rewardToken",
                "type": "address"
            }
        ],
        "name": "liquidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getAccountInformation",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "borrowedValueInUSD",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "collateralValueInUSD",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// ABI for the CToken contract
export const cTokenABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalBorrows",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "exchangeRateStored",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "supplyRatePerBlock",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "borrowRatePerBlock",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOfUnderlying",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "borrowBalanceCurrent",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];