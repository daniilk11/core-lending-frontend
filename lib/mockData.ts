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
  delay: 1000,
};


export const mockBlockchainData = [
   // Market 1 (WETH)
   { result: BigInt('100000000000000000000') },    // totalSupply
   { result: BigInt('50000000000000000000') },     // totalBorrows
   { result: BigInt('1000000000000000000') },      // exchangeRate
   { result: BigInt('200000000000') },             // price - $2000 (8 decimals)
   { result: BigInt('0x11daF26e5Ac90eA5fE8Cbc50A1c1418B4F01a970') },  // cTokenAddress - use the one from config
   { result: BigInt('100000000000000000000') },    // totalSupply
   { result: BigInt('300000000000000000') },       // supplyRatePerBlock
   { result: BigInt('450000000000000000') },       // borrowRatePerBlock
   
   // Market 2 (LINK)
   { result: BigInt('1000000000000000000000') },   // totalSupply
   { result: BigInt('500000000000000000000') },    // totalBorrows
   { result: BigInt('1000000000000000000') },      // exchangeRate
   { result: BigInt('1700000000') },               // price - $17 (8 decimals)
   { result: BigInt('0x6cC4983A79A45e74Ad31cb8326C44eEA628E7a35') },  // cTokenAddress - use the one from config
   { result: BigInt('1000000000000000000000') },   // totalSupply
   { result: BigInt('250000000000000000') },       // supplyRatePerBlock
   { result: BigInt('400000000000000000') },       // borrowRatePerBlock
   
   // Market 3 (USDC)
   { result: BigInt('1000000000000000000000') },    // totalSupply
   { result: BigInt('500000000000000000000') },    // totalBorrows
   { result: BigInt('1000000000000000000') },      // exchangeRate
   { result: BigInt('100000000') },                // price - $1 (8 decimals)
   { result: BigInt('0x6cC49') },                  // cTokenAddress - use the one from config
   { result: BigInt('1000000000000000000000') },   // totalSupply
   { result: BigInt('200000000000000000') },       // supplyRatePerBlock
   { result: BigInt('350000000000000000') },       // borrowRatePerBlock

  // Account info array - make sure these values match your expected format
  { result: [
    BigInt('90000000000000000000'),  // borrowedValue
    BigInt('2000000000000000000000')   // collateralValue
  ]},
  { result: BigInt('150000000') }  // healthFactor
];
