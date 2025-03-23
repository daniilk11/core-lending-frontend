import { mockBlockchainData } from './mockData';

export const mockDataProvider = {

  async getBlockchainData() {
    return mockBlockchainData;
  },

  async getBalance(address: string) {
    return mockBlockchainData.balance;
  },
}; 