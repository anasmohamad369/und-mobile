import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Retailer } from '../types';

export const authApi = {
  sendOtp: async (mobile: string): Promise<ApiResponse<{ sent: boolean; message: string }>> => {
    return mockBackendEngine.sendOtp(mobile);
  },

  verifyOtp: async (mobile: string, otp: string): Promise<ApiResponse<{ verificationToken: string; retailer?: Retailer; token?: string }>> => {
    return mockBackendEngine.verifyOtp(mobile, otp);
  },

  registerRetailer: async (data: Partial<Retailer>): Promise<ApiResponse<{ retailer: Retailer; token: string }>> => {
    return mockBackendEngine.registerRetailer(data);
  },
};
