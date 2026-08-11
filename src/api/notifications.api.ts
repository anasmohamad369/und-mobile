import { mockBackendEngine } from './mockEngine';
import { ApiResponse, NotificationItem } from '../types';

export const notificationsApi = {
  getNotifications: async (): Promise<ApiResponse<NotificationItem[]>> => {
    return mockBackendEngine.getNotifications();
  },

  markRead: async (id: string): Promise<ApiResponse<boolean>> => {
    return mockBackendEngine.markNotificationRead(id);
  },
};
