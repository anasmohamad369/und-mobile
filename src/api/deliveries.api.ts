import { mockBackendEngine } from './mockEngine';
import { ApiResponse, DeliveryDateOption } from '../types';

export const deliveriesApi = {
  getDeliveryOptions: async (): Promise<ApiResponse<DeliveryDateOption[]>> => {
    return mockBackendEngine.getDeliveryOptions();
  },
};
