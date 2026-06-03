// src/i18n.ts
export type Lang = 'ko' | 'en';

export function getLang(): Lang {
  return (localStorage.getItem('app_language') as Lang) || 'ko';
}

export const translations = {
  ko: {
    // 네비게이션
    nav_home: '홈',
    nav_chat: 'AI 채팅',
    nav_family: '가족 계정',
    nav_more: '더보기',
    nav_menu: '메뉴',
    nav_alarms: '알림',

    // 홈
    home_title: '건강한 하루를 시작하세요',
    home_subtitle: '오늘의 복약 현황을 확인하세요',
    home_search: '약 이름, 성분 검색',
    home_today: '오늘 복용',
    home_registered: '등록된 약',
    home_alarms: '예정 알람',
    home_med_list: '내 약 목록',
    home_add: '+ 추가',
    home_no_meds: '등록된 약이 없습니다.',
    home_add_med: '+ 약 추가하기',
    home_reg_value: '{n}개',
    home_alarm_value: '{n}건',
    home_today_alarm: '오늘의 알림',
    home_view_all: '전체보기',
    home_done: '복용 완료',
    home_completed: '복용 완료',

    // AI 채팅
    chat_title: 'AI 건강 도우미',
    chat_subtitle: '약 추천 · 처방전 분석',
    chat_new: '+ 새 대화',
    chat_placeholder: '약 이름을 입력하세요...',
    chat_loading: 'AI 분석 중...',
    chat_welcome: '안녕하세요! AI 건강 도우미입니다.\n약 이름을 입력하거나 궁금한 점을 물어보세요.\n\n📎 이미지 첨부 시 처방전 사진만 업로드해 주세요.',

    // 가족 계정
    family_title: '가족 계정',
    family_subtitle: '가족 구성원을 관리하세요',
    family_add: '+ 구성원 추가',
    family_no_members: '등록된 가족 구성원이 없습니다.',
    family_name: '이름',
    family_relation: '관계',
    family_phone: '전화번호',
    family_add_btn: '추가하기',
    family_cancel: '취소',

    // 더보기
    more_title: '더보기',
    more_download: 'link26 앱 다운로드',
    more_download_sub: 'Android APK · 최신 버전',
    more_download_btn: '다운로드',
    more_family: '가족 계정',
    more_family_sub: '가족 구성원 관리',
    more_alarm: '알림',
    more_alarm_sub: '복약 알림 확인',
    more_notification: '알림 설정',
    more_notification_sub: '전화/푸시 알림 설정',
    more_display: '표시 설정',
    more_display_sub: '글자 크기, 화면 구성',
    more_language: '언어 설정',
    more_language_sub: '한국어 / English',
    more_help: '도움말',
    more_help_sub: '사용 가이드 및 FAQ',

    // 알림
    alarm_title: '알림',
    alarm_done: '복용 완료',
    alarm_pending: '예정',

    // 공통
    save: '저장',
    saved: '저장되었습니다!',
    cancel: '취소',
    add: '추가',
    adding: '추가 중...',
    error: '오류가 발생했습니다.',
  },
  en: {
    // 네비게이션
    nav_home: 'Home',
    nav_chat: 'AI Chat',
    nav_family: 'Family',
    nav_more: 'More',
    nav_menu: 'Menu',
    nav_alarms: 'Alarms',

    // 홈
    home_title: 'Start a Healthy Day',
    home_subtitle: 'Check today\'s medication status',
    home_search: 'Search medication name, ingredient',
    home_today: 'Today',
    home_registered: 'Medications',
    home_alarms: 'Alarms',
    home_med_list: 'My Medications',
    home_add: '+ Add',
    home_no_meds: 'No medications registered.',
    home_add_med: '+ Add Medication',
    home_reg_value: '{n}',
    home_alarm_value: '{n}',
    home_today_alarm: 'Today\'s Alarms',
    home_view_all: 'View All',
    home_done: 'Take',
    home_completed: 'Completed',

    // AI 채팅
    chat_title: 'AI Health Assistant',
    chat_subtitle: 'Drug recommendation · Prescription analysis',
    chat_new: '+ New Chat',
    chat_placeholder: 'Enter medication name...',
    chat_loading: 'AI analyzing...',
    chat_welcome: 'Hello! I\'m your AI Health Assistant.\nEnter a medication name or ask any health questions.',

    // 가족 계정
    family_title: 'Family Account',
    family_subtitle: 'Manage family members',
    family_add: '+ Add Member',
    family_no_members: 'No family members registered.',
    family_name: 'Name',
    family_relation: 'Relation',
    family_phone: 'Phone',
    family_add_btn: 'Add',
    family_cancel: 'Cancel',

    // 더보기
    more_title: 'More',
    more_download: 'Download link26 App',
    more_download_sub: 'Android APK · Latest Version',
    more_download_btn: 'Download',
    more_family: 'Family Account',
    more_family_sub: 'Manage family members',
    more_alarm: 'Alarms',
    more_alarm_sub: 'Check medication alarms',
    more_notification: 'Notifications',
    more_notification_sub: 'Call/push notification settings',
    more_display: 'Display Settings',
    more_display_sub: 'Font size, layout',
    more_language: 'Language',
    more_language_sub: '한국어 / English',
    more_help: 'Help',
    more_help_sub: 'Usage guide & FAQ',

    // 알림
    alarm_title: 'Alarms',
    alarm_done: 'Completed',
    alarm_pending: 'Pending',

    // 공통
    save: 'Save',
    saved: 'Saved!',
    cancel: 'Cancel',
    add: 'Add',
    adding: 'Adding...',
    error: 'An error occurred.',
  }
};

export function t(key: keyof typeof translations['ko']): string {
  const lang = getLang();
  return translations[lang][key] ?? translations['ko'][key] ?? key;
}

