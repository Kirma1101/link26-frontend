// src/types/index.ts
// Flutter link_models.dart, alarm_item.dart, medicine.dart 기반

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

// Flutter Medication (link_models.dart)
export interface Medication {
  id: string;
  name: string;
  englishName: string;
  dose: string;
  frequency: string;
  time: string;
  completed: boolean;
}

// Flutter AlarmItem (alarm_item.dart)
export type AlarmType = 'app' | 'call';

export interface Alarm {
  id: string;
  dateLabel: string;
  time: string;
  type: AlarmType;
  medicineName: string;
  dose: string;
  status: '예정' | '복용 완료';
}

// Flutter FamilyMember (link_models.dart)
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  avatarText: string;
}

// Flutter HomeDashboardDto (home_api_service.dart)
export interface DashboardData {
  medications: Medication[];
  alarms: Alarm[];
  completedCount: number;
  totalCount: number;
}

// Flutter NotificationSettingsDto
export interface NotificationSettings {
  all: boolean;
  message: boolean;
  family: boolean;
  phone: boolean;
}

// Flutter ChatMessage
export interface ChatMessage {
  id: string;
  isUser: boolean;
  text: string;
  time: string;
  medicine?: Medication;
}
