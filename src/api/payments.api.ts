import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Order, PaymentVerification } from '../types';

export const paymentsApi = {
  verifyPayment: async (verification: PaymentVerification): Promise<ApiResponse<Order>> => {
    return mockBackendEngine.verifyPayment(verification);
  },
};
