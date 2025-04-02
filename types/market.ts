export interface MarketData {
    address: string;
    asset: string;
    price: number;
    ltv: number;
    decimals: number;
    totalSupply: number;
    totalBorrows: number;
    supplyAPR: number;
    borrowAPR: number;
}