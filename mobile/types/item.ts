import { User } from './user';

export type ItemCategory =
  | 'Mobile Phone'
  | 'Laptop'
  | 'Wallet'
  | 'Bag'
  | 'Keys'
  | 'Documents'
  | 'ID Card'
  | 'Earphones'
  | 'Watch'
  | 'Jewellery'
  | 'Clothing'
  | 'Camera'
  | 'Bicycle'
  | 'Other';

export type ItemStatus = 'ACTIVE' | 'MATCHED' | 'RETURNED' | 'CLOSED';

export interface ItemLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city: string;
  state?: string;
  country?: string;
  approximateArea: string;
}

export interface AIVisualAnalysis {
  category: string;
  brand?: string;
  model?: string;
  primaryColor: string;
  secondaryColors?: string[];
  visibleText?: string[];
  distinctiveFeatures?: string[];
  objectDescription: string;
  confidence: number;
}

export interface LostItem {
  _id: string;
  userId: string | User;
  title: string;
  description: string;
  category: ItemCategory | string;
  brand?: string;
  model?: string;
  color: string;
  distinctiveFeatures?: string[];
  lostDate: string;
  lostLocation: ItemLocation;
  images: string[];
  status: ItemStatus;
  aiDescription?: string;
  aiAnalysis?: AIVisualAnalysis;
  privateVerificationDetails?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoundItem {
  _id: string;
  userId: string | User;
  title: string;
  description: string;
  category: ItemCategory | string;
  brand?: string;
  model?: string;
  color: string;
  distinctiveFeatures?: string[];
  foundDate: string;
  foundLocation: ItemLocation;
  images: string[];
  status: ItemStatus;
  aiDescription?: string;
  aiAnalysis?: AIVisualAnalysis;
  createdAt: string;
  updatedAt: string;
}

export type UnifiedItem = (LostItem & { reportType: 'LOST' }) | (FoundItem & { reportType: 'FOUND' });

export interface CreateLostItemPayload {
  title: string;
  description: string;
  category: string;
  brand?: string;
  model?: string;
  color: string;
  distinctiveFeatures?: string[];
  lostDate: string;
  lostLocation: ItemLocation;
  images: string[];
  privateVerificationDetails?: string;
}

export interface CreateFoundItemPayload {
  title: string;
  description: string;
  category: string;
  brand?: string;
  model?: string;
  color: string;
  distinctiveFeatures?: string[];
  foundDate: string;
  foundLocation: ItemLocation;
  images: string[];
}
