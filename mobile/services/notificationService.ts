import { apiClient } from './api';
import { AppNotification } from '../types/notification';
import { INITIAL_NOTIFICATIONS } from './mockData';

let inMemoryNotifications: AppNotification[] = [...INITIAL_NOTIFICATIONS];

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const res = await apiClient.get('/notifications');
      return res.data?.data || res.data;
    } catch {
      return inMemoryNotifications;
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch {
      const notif = inMemoryNotifications.find((n) => n._id === id);
      if (notif) notif.isRead = true;
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.post('/notifications/read-all');
    } catch {
      inMemoryNotifications.forEach((n) => (n.isRead = true));
    }
  },
};
