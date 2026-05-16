// src/store/authStore.ts
// Flutter auth_service.dart + token_storage.dart 역할
import { create } from 'zustand';
import { authApi } from '@/api';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login(email, password);
      localStorage.setItem('access_token', data.accessToken);
      set({ user: data.user, token: data.accessToken });
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.signup(name, email, password);
      localStorage.setItem('access_token', data.accessToken);
      set({ user: data.user, token: data.accessToken });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try { await authApi.logout(); } catch { /* 무시 */ }
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },

  restore: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const { data } = await authApi.me();
      set({ user: data, token });
    } catch {
      localStorage.removeItem('access_token');
      set({ user: null, token: null });
    }
  },
}));
