import { prisma } from '../config/prisma.js';
import { socketManager } from '../sockets/socket.manager.js';
import { notificationService } from './notification.service.js';

export class ChatService {
  async getOrCreateConversation(matchId: string, currentUserId: string) {
    let conversation = await prisma.conversation.findUnique({
      where: { matchId },
      include: {
        match: {
          include: {
            lostItem: true,
            foundItem: true,
            lostUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
            foundUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!conversation) {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });
      if (!match) throw new Error('Match not found');

      const isParticipant =
        match.lostUserId === currentUserId || match.foundUserId === currentUserId;

      if (!isParticipant) throw new Error('Unauthorized to access this match conversation');

      conversation = await prisma.conversation.create({
        data: {
          matchId,
          participantAId: match.lostUserId,
          participantBId: match.foundUserId,
        },
        include: {
          match: {
            include: {
              lostItem: true,
              foundItem: true,
              lostUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
              foundUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
            },
          },
          messages: {
            take: 1,
          },
        },
      });
    }

    return conversation;
  }

  async getUserConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participantAId: userId }, { participantBId: userId }],
      },
      include: {
        match: {
          include: {
            lostItem: true,
            foundItem: true,
            lostUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
            foundUser: { select: { id: true, name: true, email: true, avatar: true, isVerified: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conv) => {
      const match = conv.match;
      const isOwner = match?.lostUserId === userId;
      const otherUser = isOwner ? match?.foundUser : match?.lostUser;
      const lostItem = match?.lostItem;
      const foundItem = match?.foundItem;
      const lastMsg = conv.messages[0];

      return {
        _id: conv.id,
        id: conv.id,
        matchId: match?.id,
        otherUser: otherUser || { name: 'Unknown User' },
        itemSummary: {
          title: isOwner ? foundItem?.title || 'Found Item' : lostItem?.title || 'Lost Item',
          category: lostItem?.category || 'General',
          matchScore: match?.matchScore || 0,
          matchStatus: match?.status || 'POTENTIAL',
          lostImage: lostItem?.images?.[0],
          foundImage: foundItem?.images?.[0],
          isOwner,
        },
        lastMessage: lastMsg
          ? {
              _id: lastMsg.id,
              text: lastMsg.text,
              senderId: lastMsg.senderId,
              createdAt: lastMsg.createdAt.toISOString(),
            }
          : undefined,
        unreadCount: 0,
        updatedAt: conv.updatedAt.toISOString(),
      };
    });
  }

  async getMessages(conversationId: string, userId: string) {
    // Find conversation by conversationId or matchId
    let conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conv) {
      conv = await prisma.conversation.findUnique({
        where: { matchId: conversationId.replace('chat-', '') },
      });
    }

    if (!conv) {
      return [];
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: conv.id },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        conversationId: conv.id,
        senderId: { not: userId },
        read: false,
      },
      data: { read: true },
    });

    return messages.map((m) => ({
      _id: m.id,
      id: m.id,
      chatId: m.conversationId,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: m.sender?.name || 'User',
      sender: m.sender,
      content: m.text,
      text: m.text,
      imageUri: m.imageUri || undefined,
      isRead: m.read,
      read: m.read,
      createdAt: m.createdAt.toISOString(),
    }));
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    imageUri?: string
  ) {
    let cleanId = conversationId;
    let conv = await prisma.conversation.findUnique({
      where: { id: cleanId },
    });

    if (!conv) {
      const matchId = cleanId.replace('chat-', '');
      conv = await this.getOrCreateConversation(matchId, senderId);
      cleanId = conv.id;
    }

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true, name: true, email: true, avatar: true },
    });

    const message = await prisma.message.create({
      data: {
        conversationId: conv.id,
        senderId,
        text: content,
        imageUri: imageUri || null,
        read: false,
      },
    });

    // Touch conversation updatedAt
    await prisma.conversation.update({
      where: { id: conv.id },
      data: { updatedAt: new Date() },
    });

    const formattedMessage = {
      _id: message.id,
      id: message.id,
      chatId: conv.id,
      conversationId: conv.id,
      senderId,
      senderName: sender?.name || 'User',
      sender,
      content: message.text,
      text: message.text,
      imageUri: message.imageUri || undefined,
      isRead: message.read,
      read: message.read,
      createdAt: message.createdAt.toISOString(),
    };

    // Broadcast via Socket.IO
    socketManager.broadcastChatMessage(conv.id, formattedMessage);

    // Notify recipient
    const recipientId = conv.participantAId === senderId ? conv.participantBId : conv.participantAId;
    if (recipientId) {
      await notificationService.createNotification(
        recipientId,
        'NEW_MESSAGE',
        `New message from ${sender?.name || 'User'}`,
        content.length > 50 ? `${content.substring(0, 50)}...` : content,
        { conversationId: conv.id, senderId }
      );
    }

    return formattedMessage;
  }
}

export const chatService = new ChatService();
