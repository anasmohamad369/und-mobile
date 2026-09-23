import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Order, CreateOrderPayload, PaymentInitiation } from '../types';

export const ordersApi = {
  getOrders: async (filter?: 'ALL' | 'ACTIVE' | 'COMPLETED'): Promise<ApiResponse<Order[]>> => {
    return mockBackendEngine.getOrders(filter);
  },

  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    return mockBackendEngine.getOrderById(orderId);
  },

  createOrder: async (
    payload: Partial<CreateOrderPayload>,
    idempotencyKey?: string
  ): Promise<ApiResponse<{ order: Order; payment: PaymentInitiation }>> => {
    return mockBackendEngine.createOrder(
      {
        shopId: payload.shopId || 1,
        quantityKg: payload.quantityKg || 100,
        deliveryDate: payload.deliveryDate || new Date().toISOString().split('T')[0],
        deliverySlot: payload.deliverySlot || 'Morning',
        paymentMethod: payload.paymentMethod || 'UPI',
      },
      idempotencyKey
    );
  },
};
