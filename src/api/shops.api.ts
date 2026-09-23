import { apiClient } from './client';
import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Shop } from '../types';

export interface CreateShopPayload {
  shopNumber?: string;
  shopName: string;
  mobile: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

const mapBackendShop = (s: any): Shop => ({
  id: s.id,
  retailerId: s.retailerId,
  shopNumber: s.shopNumber || `SHOP-${s.id}`,
  shopName: s.shopName || s.name,
  name: s.shopName || s.name || `Shop #${s.id}`,
  mobile: s.mobile || '',
  address: s.address || '',
  city: s.city || 'Bhimavaram',
  state: s.state || 'Andhra Pradesh',
  pincode: s.pincode || '534201',
  latitude: s.latitude,
  longitude: s.longitude,
  status: s.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
  createdAt: s.createdAt,
});

export const shopsApi = {
  /**
   * GET /api/v1/retailer/shops
   * Fetch all registered shops belonging to authenticated retailer
   */
  getShops: async (): Promise<ApiResponse<Shop[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/retailer/shops');
      if (response.data?.success && Array.isArray(response.data.data)) {
        const shops = response.data.data.map(mapBackendShop);
        return {
          success: true,
          data: shops,
        };
      }
      return mockBackendEngine.getShops();
    } catch (e: any) {
      console.log('Real backend getShops failed, falling back to mock engine:', e?.message);
      return mockBackendEngine.getShops();
    }
  },

  /**
   * GET /api/v1/retailer/shops/{shopId}
   * Fetch specific shop details by ID
   */
  getShopById: async (shopId: number): Promise<ApiResponse<Shop>> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/retailer/shops/${shopId}`);
      if (response.data?.success && response.data.data) {
        return {
          success: true,
          data: mapBackendShop(response.data.data),
        };
      }
      return { success: false, data: {} as any, error: 'Shop not found' };
    } catch (e: any) {
      console.log(`Real backend getShopById(${shopId}) failed:`, e?.message);
      return { success: false, data: {} as any, error: e?.message || 'Failed to fetch shop' };
    }
  },

  /**
   * POST /api/v1/retailer/shops
   * Create a new shop for the retailer
   */
  addShop: async (shopData: CreateShopPayload): Promise<ApiResponse<Shop>> => {
    try {
      const payload = {
        shopNumber: shopData.shopNumber || `SHOP-${Date.now().toString().slice(-4)}`,
        shopName: shopData.shopName,
        mobile: shopData.mobile,
        address: shopData.address,
        latitude: shopData.latitude || 16.5449,
        longitude: shopData.longitude || 81.5212,
      };

      const response = await apiClient.post<ApiResponse<any>>('/retailer/shops', payload);
      if (response.data?.success && response.data.data) {
        return {
          success: true,
          data: mapBackendShop(response.data.data),
        };
      }
      return mockBackendEngine.addShop(shopData as any);
    } catch (e: any) {
      console.log('Real backend addShop failed, falling back to mock engine:', e?.message);
      return mockBackendEngine.addShop(shopData as any);
    }
  },

  /**
   * PUT /api/v1/retailer/shops/{shopId}
   * Update existing shop details
   */
  updateShop: async (shopId: number, shopData: Partial<CreateShopPayload>): Promise<ApiResponse<Shop>> => {
    try {
      const response = await apiClient.put<ApiResponse<any>>(`/retailer/shops/${shopId}`, shopData);
      if (response.data?.success && response.data.data) {
        return {
          success: true,
          data: mapBackendShop(response.data.data),
        };
      }
      return mockBackendEngine.updateShop(shopId, shopData as any);
    } catch (e: any) {
      console.log(`Real backend updateShop(${shopId}) failed:`, e?.message);
      return mockBackendEngine.updateShop(shopId, shopData as any);
    }
  },

  /**
   * DELETE /api/v1/retailer/shops/{shopId}
   * Delete specific shop
   */
  deleteShop: async (shopId: number): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`/retailer/shops/${shopId}`);
      if (response.data?.success) {
        return {
          success: true,
          data: { deleted: true },
          message: response.data.message || 'Shop deleted successfully',
        };
      }
      return mockBackendEngine.deleteShop(shopId);
    } catch (e: any) {
      console.log(`Real backend deleteShop(${shopId}) failed:`, e?.message);
      return mockBackendEngine.deleteShop(shopId);
    }
  },
};
