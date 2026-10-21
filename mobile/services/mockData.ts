import { User } from '../types/user';
import { LostItem, FoundItem } from '../types/item';
import { Match } from '../types/match';
import { ChatConversation, ChatMessage } from '../types/chat';
import { AppNotification } from '../types/notification';

export const MOCK_USERS: Record<string, User> = {
  userA: {
    _id: 'user-a-123',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    phone: '+1 (555) 234-5678',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      approximateArea: 'Mission District / Downtown',
    },
    lastActive: new Date().toISOString(),
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-09-10T12:00:00.000Z',
  },
  userB: {
    _id: 'user-b-456',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    phone: '+1 (555) 987-6543',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    location: {
      latitude: 37.7758,
      longitude: -122.418,
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      approximateArea: 'Civic Center / Market St',
    },
    lastActive: new Date().toISOString(),
    createdAt: '2026-08-15T14:30:00.000Z',
    updatedAt: '2026-09-12T09:15:00.000Z',
  },
};

export const INITIAL_LOST_ITEMS: LostItem[] = [
  {
    _id: 'lost-101',
    userId: MOCK_USERS.userA,
    title: 'Samsung Galaxy S23 Ultra (Phantom Black)',
    description:
      'Lost my black Samsung Galaxy phone while sitting near the university library coffee shop. It has a clear protective bumper case and a tiny scratch on the lower right bezel.',
    category: 'Mobile Phone',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    color: 'Black',
    distinctiveFeatures: ['Clear bumper case', 'Small hairline scratch on lower right bezel', 'Cat sticker on case inside'],
    lostDate: '2026-09-15T14:30:00.000Z',
    lostLocation: {
      latitude: 37.7749,
      longitude: -122.4194,
      city: 'San Francisco',
      approximateArea: 'Near University Library Cafe',
    },
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'ACTIVE',
    aiDescription:
      'Black flagship smartphone with curved edges, multi-lens camera module, transparent TPU protective case, visible micro-scratch on bottom bezel.',
    aiAnalysis: {
      category: 'Mobile Phone',
      brand: 'Samsung',
      model: 'Galaxy S23 series',
      primaryColor: 'Black',
      secondaryColors: ['Clear case'],
      distinctiveFeatures: ['Transparent bumper case', 'Triple camera bump', 'Bottom bezel scratch'],
      objectDescription: 'Modern dark smartphone in transparent case',
      confidence: 0.94,
    },
    privateVerificationDetails: 'Lockscreen has a watercolor painting of a Shiba Inu. There is a small sticker inside the clear case.',
    createdAt: '2026-09-15T15:00:00.000Z',
    updatedAt: '2026-09-15T15:00:00.000Z',
  },
  {
    _id: 'lost-102',
    userId: MOCK_USERS.userA,
    title: 'Vintage Leather Bifold Wallet',
    description: 'Brown distressed leather wallet with contrast cream stitching. Has student ID and transit pass.',
    category: 'Wallet',
    brand: 'Fossil',
    color: 'Brown',
    distinctiveFeatures: ['Distressed brown leather', 'Cream stitching', 'Embossed logo lower front'],
    lostDate: '2026-09-14T19:00:00.000Z',
    lostLocation: {
      latitude: 37.769,
      longitude: -122.446,
      city: 'San Francisco',
      approximateArea: 'Buena Vista Park entrance',
    },
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'ACTIVE',
    createdAt: '2026-09-14T20:15:00.000Z',
    updatedAt: '2026-09-14T20:15:00.000Z',
  },
];

export const INITIAL_FOUND_ITEMS: FoundItem[] = [
  {
    _id: 'found-201',
    userId: MOCK_USERS.userB,
    title: 'Black Samsung Smartphone in Clear Case',
    description:
      'Found a black Samsung smartphone on a bench outside the campus science center. Screen is intact, battery was at 45%. Clear case attached.',
    category: 'Mobile Phone',
    brand: 'Samsung',
    model: 'Galaxy S Series',
    color: 'Black',
    distinctiveFeatures: ['Clear protective case', 'Triple rear camera', 'Small mark near bottom corner'],
    foundDate: '2026-09-15T16:15:00.000Z',
    foundLocation: {
      latitude: 37.7755,
      longitude: -122.4185,
      city: 'San Francisco',
      approximateArea: 'Campus Science Quad / Bench',
    },
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'ACTIVE',
    aiDescription:
      'Dark android smartphone identified as Samsung Galaxy series, fitted in transparent case, noticeable scratch near bottom right corner.',
    aiAnalysis: {
      category: 'Mobile Phone',
      brand: 'Samsung',
      model: 'Galaxy S23',
      primaryColor: 'Black',
      secondaryColors: ['Clear case'],
      distinctiveFeatures: ['Clear case with rounded corners', 'Scratch on lower frame'],
      objectDescription: 'Black Samsung phone with clear protector',
      confidence: 0.92,
    },
    createdAt: '2026-09-15T16:45:00.000Z',
    updatedAt: '2026-09-15T16:45:00.000Z',
  },
  {
    _id: 'found-202',
    userId: MOCK_USERS.userB,
    title: 'Apple AirPods Pro 2 in Matte Case',
    description: 'Found wireless earbuds case on the 2nd floor library study desk table #4.',
    category: 'Earphones',
    brand: 'Apple',
    model: 'AirPods Pro 2',
    color: 'White',
    distinctiveFeatures: ['Navy blue silicone sleeve', 'Small silver carabiner attached'],
    foundDate: '2026-09-16T09:00:00.000Z',
    foundLocation: {
      latitude: 37.7745,
      longitude: -122.419,
      city: 'San Francisco',
      approximateArea: 'University Main Library 2nd Floor',
    },
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'ACTIVE',
    createdAt: '2026-09-16T09:30:00.000Z',
    updatedAt: '2026-09-16T09:30:00.000Z',
  },
];

export const INITIAL_MATCHES: Match[] = [
  {
    _id: 'match-301',
    lostItemId: INITIAL_LOST_ITEMS[0],
    foundItemId: INITIAL_FOUND_ITEMS[0],
    lostUserId: MOCK_USERS.userA,
    foundUserId: MOCK_USERS.userB,
    matchScore: 91,
    similarityBreakdown: {
      visualSimilarity: 88,
      categorySimilarity: 100,
      colorSimilarity: 95,
      brandSimilarity: 92,
      locationSimilarity: 86,
      dateSimilarity: 94,
      descriptionSimilarity: 85,
    },
    aiReasoning: [
      'Both reports describe a black Samsung Galaxy flagship smartphone with a transparent protective case.',
      'AI vision analysis detected matching triple-camera lens alignment and device dimensions.',
      'Both reports cite a visible mark / scratch near the bottom-right frame bezel.',
      'Found location is approximately 280 meters from the reported lost location on the same campus.',
      'Item was found within 2 hours of the reported lost timestamp.',
    ],
    status: 'POTENTIAL',
    verificationStatus: 'PENDING',
    verificationQuestion: 'Could you tell me what lockscreen wallpaper or hidden mark is on the phone?',
    verificationAnswerProvided: '',
    createdAt: '2026-09-15T16:50:00.000Z',
    updatedAt: '2026-09-15T16:50:00.000Z',
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'chat-match-301': [
    {
      _id: 'msg-1',
      chatId: 'chat-match-301',
      senderId: MOCK_USERS.userA._id,
      senderName: 'Alex Rivera',
      content: 'Hi Sarah! I saw the AI match alert for the Samsung phone you found. Is it still with you?',
      createdAt: '2026-09-15T17:00:00.000Z',
      isRead: true,
    },
    {
      _id: 'msg-2',
      chatId: 'chat-match-301',
      senderId: MOCK_USERS.userB._id,
      senderName: 'Sarah Chen',
      content: 'Hi Alex! Yes, I kept it safe with me at the Science Center reception. Does the phone have a cat sticker inside the case?',
      createdAt: '2026-09-15T17:02:30.000Z',
      isRead: true,
    },
    {
      _id: 'msg-3',
      chatId: 'chat-match-301',
      senderId: MOCK_USERS.userA._id,
      senderName: 'Alex Rivera',
      content: 'Yes! It has a small orange tabby cat sticker tucked between the back glass and the clear case!',
      createdAt: '2026-09-15T17:03:45.000Z',
      isRead: true,
    },
  ],
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    _id: 'notif-1',
    userId: MOCK_USERS.userA._id,
    type: 'POTENTIAL_MATCH',
    title: '🔔 Potential Match Found! (91%)',
    body: 'A nearby found Samsung smartphone closely matches your lost report. Tap to review comparison.',
    data: { matchId: 'match-301' },
    isRead: false,
    createdAt: '2026-09-15T16:50:00.000Z',
  },
  {
    _id: 'notif-2',
    userId: MOCK_USERS.userB._id,
    type: 'POTENTIAL_MATCH',
    title: '🔔 Potential Match for Found Item',
    body: 'Someone reported a lost Samsung phone that matches the item you found.',
    data: { matchId: 'match-301' },
    isRead: false,
    createdAt: '2026-09-15T16:50:00.000Z',
  },
];
