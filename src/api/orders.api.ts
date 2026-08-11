import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Order, PaymentInitiation } from '../types';

export const ordersApi = {
  createOrder: async (
    payload: {
      shopId: number;
      quantityKg: number;
      deliveryDate: string;
      deliverySlot: string;
      paymentMethod?: 'UPI' | 'CARD' | 'NET_BANKING' | 'BANK_TRANSFER';
    },
    idempotencyKey?: string
  ): Promise<ApiResponse<{ order: Order; payment: PaymentInitiation }>> => {
    return mockBackendEngine.createOrder(payload, idempotencyKey);
  },

  getOrders: async (filter?: 'ALL' | 'ACTIVE' | 'COMPLETED'): Promise<ApiResponse<Order[]>> => {
    return mockBackendEngine.getOrders(filter);
  },

  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    return mockBackendEngine.getOrderById(orderId);
  },
};
