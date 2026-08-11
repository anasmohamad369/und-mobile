import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Retailer } from '../types';

export const retailerApi = {
  getProfile: async (): Promise<ApiResponse<Retailer>> => {
    return mockBackendEngine.getRetailerProfile();
  },

  updateProfile: async (data: Partial<Retailer>): Promise<ApiResponse<Retailer>> => {
    return mockBackendEngine.updateRetailerProfile(data);
  },
};
