import axios from 'axios';
import { storage } from '../utils/storage';

// In Expo, environment variables are accessed via EXPO_PUBLIC_*
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('findlost_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful error logging
    if (error.code === 'ERR_NETWORK') {
      console.log('[apiClient] Backend offline; utilizing local store fallback.');
    }
    return Promise.reject(error);
  }
);
