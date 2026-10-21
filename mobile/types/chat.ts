import { User } from './user';
import { MatchStatus } from './match';

export interface ChatMessage {
  _id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  imageUri?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatConversation {
  _id: string;
  matchId: string;
  otherUser: User;
  itemSummary: {
    title: string;
    category: string;
    matchScore: number;
    matchStatus: MatchStatus;
    lostImage?: string;
    foundImage?: string;
    isOwner: boolean;
  };
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}
