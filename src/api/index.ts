// src/api/index.ts
// Flutter auth_api_service, home_api_service, medicine_api_service,
//         family_api_service, notification_api_service, ai_chat_service 통합
import { api } from './client';
import type {
  User, DashboardData, Medication, FamilyMember,
  NotificationSettings, ChatMessage,
} from '@/types';

// ── Auth ──────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ accessToken: string; user: User }>('/auth/login', { email, password }),

  signup: (name: string, email: string, password: string) =>
    api.post<{ accessToken: string; user: User }>('/auth/signup', { name, email, password }),

  me: () => api.get<User>('/auth/me'),

  logout: () => api.post('/auth/logout'),
};

// ── Home dashboard ────────────────────────────────
export const homeApi = {
  dashboard: () => api.get<DashboardData>('/home/dashboard'),
};

// ── Medicines ─────────────────────────────────────
export const medicinesApi = {
  list: () => api.get<Medication[]>('/medicines'),

  add: (data: Pick<Medication, 'name' | 'dose' | 'frequency' | 'time'>) =>
    api.post<{ item: Medication }>('/medicines', data),

  remove: (id: string) => api.delete(`/medicines/${id}`),
};

// ── Family ────────────────────────────────────────
export const familyApi = {
  list: () => api.get<FamilyMember[]>('/family/members'),

  add: (data: Pick<FamilyMember, 'name' | 'relation' | 'phone'>) =>
    api.post<{ item: FamilyMember }>('/family/members', data),
};

// ── Settings ──────────────────────────────────────
export const settingsApi = {
  getNotifications: () => api.get<NotificationSettings>('/settings/notifications'),
  updateNotifications: (data: NotificationSettings) =>
    api.put<NotificationSettings>('/settings/notifications', data),
};

// ── AI ────────────────────────────────────────────
export const aiApi = {
  chat: (message: string) =>
    api.post<{ answer: string }>('/ai/chat', { message }),

  prescription: (recognizedText: string) =>
    api.post<{ productName: string; signal: 'green' | 'yellow' | 'red'; recommendation: string; reason: string }>(
      '/ai/prescription',
      { recognizedText }
    ),
};
