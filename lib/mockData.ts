export function getIsTestMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isTestMode') === 'true';
}

export function setIsTestMode(value: boolean): void {
  localStorage.setItem('isTestMode', value.toString());
  // Force reload to ensure all components reflect the new mode
  window.location.reload();
}

export const mockConfig = {
  get isTestMode() {
    return getIsTestMode();
  },
};


export const mockBlockchainData = [
  // Market 1 (WETH)
  { result: BigInt('100000000000000000000') },    // totalSupply
  { result: BigInt('50000000000000000000') },     // totalBorrows
  { result: BigInt('1000000000000000000') },      // exchangeRateStored
  { result: BigInt('300000000000000000') },       // getSupplyAPR
  { result: BigInt('1000000000000000000') },      // getTotalReserves
  { result: BigInt('450000000000000000') },       // getBorrowAPR
  { result: BigInt('200000000000') },             // usdValue - $2000 (8 decimals)
  { result: '0x11daF26e5Ac90eA5fE8Cbc50A1c1418B4F01a970' },  // cTokenAddress
  { result: BigInt('50000000000000000000') },     // userSupply (balanceOfUnderlying)
  { result: BigInt('20000000000000000000') },     // userBorrow (borrowBalanceCurrent)
  
  // Market 2 (LINK)
  { result: BigInt('1000000000000000000000') },   // totalSupply
  { result: BigInt('500000000000000000000') },    // totalBorrows
  { result: BigInt('1000000000000000000') },      // exchangeRateStored
  { result: BigInt('250000000000000000') },       // getSupplyAPR
  { result: BigInt('1000000000000000000') },      // getTotalReserves
  { result: BigInt('400000000000000000') },       // getBorrowAPR
  { result: BigInt('1700000000') },               // usdValue - $17 (8 decimals)
  { result: '0x6cC4983A79A45e74Ad31cb8326C44eEA628E7a35' },  // cTokenAddress
  { result: BigInt('300000000000000000000') },    // userSupply (balanceOfUnderlying)
  { result: BigInt('100000000000000000000') },    // userBorrow (borrowBalanceCurrent)
  
  // Market 3 (USDC)
  { result: BigInt('1000000000000000000000') },   // totalSupply
  { result: BigInt('500000000000000000000') },    // totalBorrows
  { result: BigInt('1000000000000000000') },      // exchangeRateStored
  { result: BigInt('200000000000000000') },       // getSupplyAPR
  { result: BigInt('1000000000000000000') },      // getTotalReserves
  { result: BigInt('350000000000000000') },       // getBorrowAPR
  { result: BigInt('100000000') },                // usdValue - $1 (8 decimals)
  { result: '0x6cC49' },                          // cTokenAddress
  { result: BigInt('400000000000000000000') },    // userSupply (balanceOfUnderlying)
  { result: BigInt('150000000000000000000') },    // userBorrow (borrowBalanceCurrent)

  // Account info array
  { result: [
    BigInt('90000000000000000000'),  // borrowedValueInUSD
    BigInt('2000000000000000000000') // collateralValueInUSD
  ]},
  { result: BigInt('150000000') },   // healthFactor
  { result: BigInt('50000000000000000000') }  // userRewards
];
