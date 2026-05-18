// src/App.tsx
// Flutter AuthGate + MaterialApp 라우팅을 react-router-dom v6으로 재현
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomNav } from '@/components/layout/BottomNav';
import { Outlet } from 'react-router-dom';
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
