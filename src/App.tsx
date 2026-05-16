// src/App.tsx
// Flutter AuthGate + MaterialApp 라우팅을 react-router-dom v6으로 재현
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { BottomNav } from '@/components/layout/BottomNav';
import { Spinner } from '@/components/ui';

import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
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

// ── 인증 게이트 — Flutter AuthGate 역할 ──
function AuthGuard() {
  const { token, user, restore } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (token && !user) {
      restore().finally(() => setReady(true));
    } else {
      setReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return <Spinner className="h-screen" />;
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// ── 하단 탭 레이아웃 ──
function MainLayout() {
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
          {/* 공개 라우트 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 보호 라우트 — 로그인 필요 */}
          <Route element={<AuthGuard />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/more" element={<MorePage />} />
              <Route path="/family" element={<FamilyPage />} />
              <Route path="/alarms" element={<AllAlarmsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
