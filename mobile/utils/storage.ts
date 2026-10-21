import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const memoryFallbackStore = new Map<string, string>();

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return memoryFallbackStore.get(key) || null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn(`[storage] getItem failed for key "${key}":`, e);
      return memoryFallbackStore.get(key) || null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
        memoryFallbackStore.set(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.warn(`[storage] setItem failed for key "${key}":`, e);
      memoryFallbackStore.set(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
        memoryFallbackStore.delete(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn(`[storage] removeItem failed for key "${key}":`, e);
      memoryFallbackStore.delete(key);
    }
  },
};
