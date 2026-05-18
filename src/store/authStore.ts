// src/store/authStore.ts
import { create } from 'zustand';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export const useAuthStore = create<AuthStore>(() => ({
  user: null,
  token: null,
  isLoading: false,
}));
