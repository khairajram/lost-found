import { prisma } from '../config/prisma.js';
import { socketManager } from '../sockets/socket.manager.js';

export class NotificationService {
  async createNotification(
    userId: string,
    type: string,
    title: string,
    body: string,
    data?: any
  ) {
    const notif = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: data || {},
      },
    });

    // Real-time push via Socket.IO
    socketManager.sendNotificationToUser(userId, notif);

    return notif;
  }

  async notifyMatchFound(
    match: { id: string; matchScore: number },
    lost: { id: string; userId: string; title: string },
    found: { id: string; userId: string; title: string }
  ): Promise<void> {
    // Notify lost-item owner
    await this.createNotification(
      lost.userId,
      'POTENTIAL_MATCH',
      `🔔 Potential Match Found! (${match.matchScore}%)`,
      `Someone reported finding an item that may match your lost ${lost.title}.`,
      {
        matchId: match.id,
        lostItemId: lost.id,
        foundItemId: found.id,
        matchScore: match.matchScore,
      }
    );

    // Notify found-item reporter
    await this.createNotification(
      found.userId,
      'POTENTIAL_MATCH',
      `🔔 Someone May Have Lost Your Found Item (${match.matchScore}%)`,
      `A nearby lost-item report appears very similar to the ${found.title} you found.`,
      {
        matchId: match.id,
        lostItemId: lost.id,
        foundItemId: found.id,
        matchScore: match.matchScore,
      }
    );
  }

  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}

export const notificationService = new NotificationService();
