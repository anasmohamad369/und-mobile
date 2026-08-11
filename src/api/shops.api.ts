import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Shop } from '../types';

export const shopsApi = {
  getShops: async (): Promise<ApiResponse<Shop[]>> => {
    return mockBackendEngine.getShops();
  },

  addShop: async (shopData: Omit<Shop, 'id' | 'retailerId' | 'status'>): Promise<ApiResponse<Shop>> => {
    return mockBackendEngine.addShop(shopData);
  },
};
