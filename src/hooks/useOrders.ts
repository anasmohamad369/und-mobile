import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';
import { paymentsApi } from '../api/payments.api';
import { PaymentVerification } from '../types';

export const useOrders = (filter?: 'ALL' | 'ACTIVE' | 'COMPLETED') => {
  return useQuery({
    queryKey: ['orders', filter],
    queryFn: async () => {
      const res = await ordersApi.getOrders(filter);
      if (!res.success) throw new Error(res.error || 'Failed to fetch orders');
      return res.data;
    },
    refetchInterval: 10000, // Poll active order status
  });
};

export const useSingleOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await ordersApi.getOrderById(orderId);
      if (!res.success) throw new Error(res.error || 'Failed to fetch order');
      return res.data;
    },
    enabled: !!orderId,
    refetchInterval: 5000,
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      payload: {
        shopId: number;
        quantityKg: number;
        deliveryDate: string;
        deliverySlot: string;
        paymentMethod?: 'UPI' | 'CARD' | 'NET_BANKING' | 'BANK_TRANSFER';
      };
      idempotencyKey?: string;
    }) => {
      const res = await ordersApi.createOrder(vars.payload, vars.idempotencyKey);
      if (!res.success) throw new Error(res.error || 'Order creation failed');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryAvailability'] });
    },
  });
};

export const useVerifyPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (verification: PaymentVerification) => {
      const res = await paymentsApi.verifyPayment(verification);
      if (!res.success) throw new Error(res.error || 'Payment verification failed');
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      queryClient.invalidateQueries({ queryKey: ['inventoryAvailability'] });
    },
  });
};
