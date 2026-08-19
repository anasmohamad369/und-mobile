import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Shop } from '../types';

export const shopsApi = {
  getShops: async (): Promise<ApiResponse<Shop[]>> => {
    return mockBackendEngine.getShops();
  },

  addShop: async (shopData: Omit<Shop, 'id' | 'retailerId' | 'status'>): Promise<ApiResponse<Shop>> => {
    return mockBackendEngine.addShop(shopData);
  },

  updateShop: async (shopId: number, shopData: Partial<Shop>): Promise<ApiResponse<Shop>> => {
    return mockBackendEngine.updateShop(shopId, shopData);
  },

  deleteShop: async (shopId: number): Promise<ApiResponse<{ deleted: boolean }>> => {
    return mockBackendEngine.deleteShop(shopId);
  },
};
