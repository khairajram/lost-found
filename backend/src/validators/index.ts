import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

const LocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  country: z.string().optional(),
  approximateArea: z.string().min(1, 'Approximate area is required'),
});

export const createLostItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().min(1, 'Color is required'),
  distinctiveFeatures: z.array(z.string()).optional(),
  lostDate: z.string().optional(),
  lostLocation: LocationSchema,
  images: z.array(z.string()).min(1, 'At least 1 image is required'),
  privateVerificationDetails: z.string().optional(),
});

export const createFoundItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().min(1, 'Color is required'),
  distinctiveFeatures: z.array(z.string()).optional(),
  foundDate: z.string().optional(),
  foundLocation: LocationSchema,
  images: z.array(z.string()).min(1, 'At least 1 image is required'),
});

export const verifyOwnershipSchema = z.object({
  answer: z.string().min(2, 'Identifying answer must be at least 2 characters'),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty'),
  imageUri: z.string().optional(),
});
