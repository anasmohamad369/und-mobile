import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationsApi.getNotifications();
      if (!res.success) throw new Error(res.error || 'Failed to fetch notifications');
      return res.data;
    },
    refetchInterval: 15000,
  });
};

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await notificationsApi.markRead(id);
      if (!res.success) throw new Error('Failed to mark read');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
