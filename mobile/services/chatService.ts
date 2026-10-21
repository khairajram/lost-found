import { apiClient } from './api';
import { ChatConversation, ChatMessage } from '../types/chat';
import { INITIAL_MESSAGES, MOCK_USERS } from './mockData';
import { matchService } from './matchService';

let inMemoryMessages: Record<string, ChatMessage[]> = { ...INITIAL_MESSAGES };

const createUniqueMessageId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const chatService = {
  async getConversations(currentUserId: string): Promise<ChatConversation[]> {
    try {
      const res = await apiClient.get('/chats');
      const rawList = res.data?.data || res.data;
      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map((conv: any) => ({
          _id: conv._id || conv.id,
          matchId: conv.matchId || conv.match?.id,
          otherUser: conv.otherUser || { name: 'User', email: '' },
          itemSummary: conv.itemSummary || {
            title: 'Matched Item',
            category: 'General',
            matchScore: 90,
            matchStatus: 'POTENTIAL',
            isOwner: false,
          },
          lastMessage: conv.lastMessage
            ? {
                _id: conv.lastMessage._id || conv.lastMessage.id,
                chatId: conv._id || conv.id,
                senderId: conv.lastMessage.senderId,
                senderName: conv.lastMessage.senderName || 'User',
                content: conv.lastMessage.content || conv.lastMessage.text || '',
                imageUri: conv.lastMessage.imageUri,
                createdAt: conv.lastMessage.createdAt || new Date().toISOString(),
                isRead: conv.lastMessage.isRead ?? conv.lastMessage.read ?? true,
              }
            : undefined,
          unreadCount: conv.unreadCount || 0,
          updatedAt: conv.updatedAt || new Date().toISOString(),
        }));
      }
      throw new Error('No conversations from API, using fallback');
    } catch {
      const matches = await matchService.getMatches();
      const conversations: ChatConversation[] = matches.map((match) => {
        const isOwner =
          typeof match.lostUserId === 'object'
            ? match.lostUserId._id === currentUserId
            : match.lostUserId === currentUserId;

        const otherUser = isOwner
          ? (typeof match.foundUserId === 'object' ? match.foundUserId : MOCK_USERS.userB)
          : (typeof match.lostUserId === 'object' ? match.lostUserId : MOCK_USERS.userA);

        const chatId = `chat-${match._id}`;
        const msgs = inMemoryMessages[chatId] || [];
        const lastMsg = msgs[msgs.length - 1];

        const lostTitle = typeof match.lostItemId === 'object' ? match.lostItemId.title : 'Lost Item';
        const foundTitle = typeof match.foundItemId === 'object' ? match.foundItemId.title : 'Found Item';
        const lostImage = typeof match.lostItemId === 'object' ? match.lostItemId.images[0] : undefined;
        const foundImage = typeof match.foundItemId === 'object' ? match.foundItemId.images[0] : undefined;
        const category = typeof match.lostItemId === 'object' ? match.lostItemId.category : 'General';

        return {
          _id: chatId,
          matchId: match._id,
          otherUser,
          itemSummary: {
            title: isOwner ? foundTitle : lostTitle,
            category,
            matchScore: match.matchScore,
            matchStatus: match.status,
            lostImage,
            foundImage,
            isOwner,
          },
          lastMessage: lastMsg,
          unreadCount: 0,
          updatedAt: lastMsg?.createdAt || match.createdAt,
        };
      });
      return conversations;
    }
  },

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    try {
      const res = await apiClient.get(`/chats/${chatId}/messages`);
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw)) {
        const messages: ChatMessage[] = raw.map((m: any) => ({
          _id: m._id || m.id || createUniqueMessageId(),
          chatId: m.chatId || m.conversationId || chatId,
          senderId: m.senderId || m.sender?.id || m.sender?._id || 'unknown',
          senderName: m.senderName || m.sender?.name || 'User',
          content: m.content || m.text || '',
          imageUri: m.imageUri || undefined,
          createdAt: m.createdAt || new Date().toISOString(),
          isRead: m.isRead !== undefined ? m.isRead : (m.read ?? false),
        }));

        inMemoryMessages[chatId] = messages;
        return messages;
      }
      return inMemoryMessages[chatId] || [];
    } catch {
      return inMemoryMessages[chatId] || [];
    }
  },

  async sendMessage(
    chatId: string,
    content: string,
    sender = MOCK_USERS.userA,
    imageUri?: string
  ): Promise<ChatMessage> {
    const senderId = sender._id || (sender as any).id || 'user-a-123';
    try {
      const res = await apiClient.post(`/chats/${chatId}/messages`, {
        content,
        text: content,
        senderId,
        imageUri,
      });
      const m = res.data?.data || res.data;
      const formatted: ChatMessage = {
        _id: m?._id || m?.id || createUniqueMessageId(),
        chatId: m?.chatId || m?.conversationId || chatId,
        senderId: m?.senderId || senderId,
        senderName: m?.senderName || m?.sender?.name || sender.name || 'User',
        content: m?.content || m?.text || content,
        imageUri: m?.imageUri || imageUri,
        createdAt: m?.createdAt || new Date().toISOString(),
        isRead: m?.isRead !== undefined ? m?.isRead : (m?.read ?? false),
      };

      if (!inMemoryMessages[chatId]) {
        inMemoryMessages[chatId] = [];
      }
      inMemoryMessages[chatId].push(formatted);
      return formatted;
    } catch {
      const newMsg: ChatMessage = {
        _id: createUniqueMessageId(),
        chatId,
        senderId,
        senderName: sender.name || 'User',
        content,
        imageUri,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      if (!inMemoryMessages[chatId]) {
        inMemoryMessages[chatId] = [];
      }
      inMemoryMessages[chatId].push(newMsg);
      return newMsg;
    }
  },
};
