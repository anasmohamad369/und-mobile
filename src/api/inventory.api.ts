import { mockBackendEngine } from './mockEngine';
import { ApiResponse, InventoryAvailability } from '../types';

export const inventoryApi = {
  getAvailability: async (): Promise<ApiResponse<InventoryAvailability>> => {
    return mockBackendEngine.getInventoryAvailability();
  },
};
