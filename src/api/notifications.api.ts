import { mockBackendEngine } from './mockEngine';
import { ApiResponse, NotificationItem } from '../types';

export const notificationsApi = {
  getNotifications: async (): Promise<ApiResponse<NotificationItem[]>> => {
    return mockBackendEngine.getNotifications();
  },

  markAsRead: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await mockBackendEngine.markNotificationRead(id);
    return { success: res.success, data: true };
  },

  markRead: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await mockBackendEngine.markNotificationRead(id);
    return { success: res.success, data: true };
  },
};
