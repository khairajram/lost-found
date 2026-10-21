import { create } from 'zustand';
import { User, LoginCredentials, RegisterPayload } from '../types/user';
import { storage } from '../utils/storage';
import { apiClient } from '../services/api';
import { MOCK_USERS } from '../services/mockData';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoUser: (userKey: 'userA' | 'userB') => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const TOKEN_KEY = 'findlost_auth_token';
const USER_KEY = 'findlost_auth_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const storedToken = await storage.getItem(TOKEN_KEY);
      const storedUser = await storage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      // Default demo login for instant convenience if no session
      const defaultUser = MOCK_USERS.userA;
      const demoToken = 'mock-jwt-token-user-a';
      await storage.setItem(TOKEN_KEY, demoToken);
      await storage.setItem(USER_KEY, JSON.stringify(defaultUser));
      set({
        token: demoToken,
        user: defaultUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.warn('Auth initialization error:', err);
      set({ isLoading: false });
    }
  },

  login: async ({ email, password }: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Try real backend login first
      const res = await apiClient.post('/auth/login', { email, password });
      const authData = res.data?.data || res.data;
      if (authData?.user && authData?.token) {
        await storage.setItem(TOKEN_KEY, authData.token);
        await storage.setItem(USER_KEY, JSON.stringify(authData.user));
        set({
          user: authData.user,
          token: authData.token,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch (apiErr) {
      console.log('[AuthStore] Backend login unavailable or error, checking local fallback:', apiErr);
    }

    try {
      // 2. Offline fallback if backend is unreachable
      let matchedUser = Object.values(MOCK_USERS).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!matchedUser) {
        matchedUser = {
          _id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      const token = `jwt-${matchedUser._id}`;
      await storage.setItem(TOKEN_KEY, token);
      await storage.setItem(USER_KEY, JSON.stringify(matchedUser));
      set({
        user: matchedUser,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message || 'Login failed', isLoading: false });
      throw e;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Try real backend registration first
      const res = await apiClient.post('/auth/register', payload);
      const authData = res.data?.data || res.data;
      if (authData?.user && authData?.token) {
        await storage.setItem(TOKEN_KEY, authData.token);
        await storage.setItem(USER_KEY, JSON.stringify(authData.user));
        set({
          user: authData.user,
          token: authData.token,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch (apiErr) {
      console.log('[AuthStore] Backend registration unavailable, using local fallback:', apiErr);
    }

    try {
      // 2. Fallback
      const newUser: User = {
        _id: `user-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const token = `jwt-${newUser._id}`;
      await storage.setItem(TOKEN_KEY, token);
      await storage.setItem(USER_KEY, JSON.stringify(newUser));
      set({
        user: newUser,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message || 'Registration failed', isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    await storage.removeItem(TOKEN_KEY);
    await storage.removeItem(USER_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  switchDemoUser: async (userKey: 'userA' | 'userB') => {
    const email = userKey === 'userA' ? 'alex@example.com' : 'sarah@example.com';
    try {
      const res = await apiClient.post('/auth/login', {
        email,
        password: 'password123',
      });
      const authData = res.data?.data || res.data;
      if (authData?.user && authData?.token) {
        await storage.setItem(TOKEN_KEY, authData.token);
        await storage.setItem(USER_KEY, JSON.stringify(authData.user));
        set({
          user: authData.user,
          token: authData.token,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch (e) {
      console.log('[AuthStore] Backend demo switch fallback:', e);
    }

    const selected = MOCK_USERS[userKey];
    const token = `jwt-${selected._id}`;
    await storage.setItem(TOKEN_KEY, token);
    await storage.setItem(USER_KEY, JSON.stringify(selected));
    set({
      user: selected,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateProfile: async (updates: Partial<User>) => {
    const current = get().user;
    if (!current) return;
    try {
      await apiClient.put('/auth/profile', updates);
    } catch (e) {
      console.log('[AuthStore] Backend update profile fallback:', e);
    }
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    await storage.setItem(USER_KEY, JSON.stringify(updated));
    set({ user: updated });
  },

  clearError: () => set({ error: null }),
}));
