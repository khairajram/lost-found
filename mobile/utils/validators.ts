import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const reportItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().min(1, 'Please specify the primary color'),
  description: z.string().min(10, 'Please provide a detailed description (at least 10 characters)'),
  distinctiveFeatures: z.array(z.string()).optional(),
  date: z.string().min(1, 'Date is required'),
  approximateArea: z.string().min(2, 'Location area is required'),
  city: z.string().min(1, 'City is required'),
  latitude: z.number(),
  longitude: z.number(),
  images: z.array(z.string()).min(1, 'Please upload at least 1 photo of the item'),
  privateVerificationDetails: z.string().optional(),
});

export type ReportItemFormData = z.infer<typeof reportItemSchema>;

export const verificationSchema = z.object({
  secretAnswer: z.string().min(2, 'Please provide identifying information'),
});

export type VerificationFormData = z.infer<typeof verificationSchema>;
