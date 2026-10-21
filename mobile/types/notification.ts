export type NotificationType =
  | 'POTENTIAL_MATCH'
  | 'MATCH_ACCEPTED'
  | 'NEW_MESSAGE'
  | 'VERIFICATION_REQUEST'
  | 'ITEM_RETURNED'
  | 'SYSTEM';

export interface AppNotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: {
    matchId?: string;
    chatId?: string;
    lostItemId?: string;
    foundItemId?: string;
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: string;
}
