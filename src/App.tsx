// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomNav } from '@/components/layout/BottomNav';
import { Outlet, useEffect } from 'react';

import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import MorePage from '@/pages/MorePage';
import FamilyPage from '@/pages/FamilyPage';
import AllAlarmsPage from '@/pages/AllAlarmsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 },
  },
});

// 저장된 표시 설정 초기화
function initDisplaySettings() {
  const fontSize = localStorage.getItem('display_fontSize') || 'medium';
  const layout = localStorage.getItem('display_layout') || 'comfortable';
  const sizeMap: Record<string, string> = { small: '14px', medium: '16px', large: '18px' };
  document.body.style.fontSize = sizeMap[fontSize];
  const maxWidthMap: Record<string, string> = { comfortable: '900px', compact: '700px', responsive: '100%' };
  document.documentElement.style.setProperty('--app-max-width', maxWidthMap[layout]);
}

function MainLayout() {
  useEffect(() => {
    initDisplaySettings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <BottomNav />
      <main className="pt-28 px-0 w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="/family" element={<FamilyPage />} />
            <Route path="/alarms" element={<AllAlarmsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
