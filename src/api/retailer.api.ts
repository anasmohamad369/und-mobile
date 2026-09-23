import { apiClient } from './client';
import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Retailer } from '../types';

const mapBackendRetailer = (data: any): Retailer => ({
  id: data.id || data.retailerId || data.userId || 1,
  businessName: data.businessName || 'NutriFarm Retailer',
  ownerName: data.ownerName || data.fullName || 'Mohammed',
  mobile: data.mobile || data.username || '',
  email: data.email || '',
  addressLine1: data.addressLine1 || (data.shops && data.shops[0]?.address) || 'Main Market',
  city: data.city || (data.shops && data.shops[0]?.city) || 'Bhimavaram',
  state: data.state || 'Andhra Pradesh',
  pincode: data.pincode || '534201',
  status: data.status || 'ACTIVE',
  createdAt: data.createdAt || new Date().toISOString(),
});

export const retailerApi = {
  /**
   * GET /api/v1/retailer/profile
   * Fetch authenticated retailer profile details
   */
  getProfile: async (): Promise<ApiResponse<Retailer>> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/retailer/profile');
      if (response.data?.success && response.data.data) {
        return {
          success: true,
          data: mapBackendRetailer(response.data.data),
        };
      }
      return mockBackendEngine.getRetailerProfile();
    } catch (e: any) {
      console.log('Real backend getProfile failed, falling back to mock engine:', e?.message);
      return mockBackendEngine.getRetailerProfile();
    }
  },

  /**
   * PUT /api/v1/retailer/profile
   * Update logged-in retailer profile (businessName, ownerName)
   */
  updateProfile: async (data: Partial<Retailer>): Promise<ApiResponse<Retailer>> => {
    try {
      const payload = {
        businessName: data.businessName,
        ownerName: data.ownerName,
        email: data.email,
        mobile: data.mobile,
      };

      const response = await apiClient.put<ApiResponse<any>>('/retailer/profile', payload);
      if (response.data?.success && response.data.data) {
        return {
          success: true,
          data: mapBackendRetailer(response.data.data),
        };
      }
      return mockBackendEngine.updateRetailerProfile(data);
    } catch (e: any) {
      console.log('Real backend updateProfile failed, falling back to mock engine:', e?.message);
      return mockBackendEngine.updateRetailerProfile(data);
    }
  },
};
