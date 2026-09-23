import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Order, PaymentVerification } from '../types';

export const paymentsApi = {
  verifyPayment: async (payload: PaymentVerification): Promise<ApiResponse<Order>> => {
    const res = await mockBackendEngine.verifyPayment(payload);
    return { success: res.success, data: res.data.order, error: res.error };
  },
};
