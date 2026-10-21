import { ItemCategory } from '../types/item';

export interface CategoryDefinition {
  label: ItemCategory;
  icon: string;
  color: string;
}

export const ITEM_CATEGORIES: CategoryDefinition[] = [
  { label: 'Mobile Phone', icon: 'smartphone', color: '#3B82F6' },
  { label: 'Laptop', icon: 'laptop', color: '#6366F1' },
  { label: 'Wallet', icon: 'credit-card', color: '#F59E0B' },
  { label: 'Bag', icon: 'briefcase', color: '#EC4899' },
  { label: 'Keys', icon: 'key', color: '#10B981' },
  { label: 'Documents', icon: 'file-text', color: '#8B5CF6' },
  { label: 'ID Card', icon: 'badge', color: '#06B6D4' },
  { label: 'Earphones', icon: 'headphones', color: '#14B8A6' },
  { label: 'Watch', icon: 'watch', color: '#EAB308' },
  { label: 'Jewellery', icon: 'sparkles', color: '#F43F5E' },
  { label: 'Clothing', icon: 'shirt', color: '#A855F7' },
  { label: 'Camera', icon: 'camera', color: '#0284C7' },
  { label: 'Bicycle', icon: 'bike', color: '#22C55E' },
  { label: 'Other', icon: 'package', color: '#64748B' },
];

export const COMMON_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Silver/Grey', hex: '#94A3B8' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow/Gold', hex: '#F59E0B' },
  { name: 'Brown', hex: '#854D0E' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
];
