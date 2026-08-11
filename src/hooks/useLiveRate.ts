import { useQuery } from '@tanstack/react-query';
import { ratesApi } from '../api/rates.api';

export const useLiveRate = () => {
  return useQuery({
    queryKey: ['liveRate'],
    queryFn: async () => {
      const res = await ratesApi.getLiveRate();
      if (!res.success) throw new Error(res.error || 'Failed to fetch live rate');
      return res.data;
    },
    refetchInterval: 30000, // Background poll every 30 seconds
  });
};
