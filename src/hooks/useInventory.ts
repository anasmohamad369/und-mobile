import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';

export const useInventory = () => {
  return useQuery({
    queryKey: ['inventoryAvailability'],
    queryFn: async () => {
      const res = await inventoryApi.getAvailability();
      if (!res.success) throw new Error(res.error || 'Failed to fetch inventory availability');
      return res.data;
    },
    refetchInterval: 15000,
  });
};
