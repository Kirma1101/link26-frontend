// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import MorePage from '@/pages/MorePage';
import FamilyPage from '@/pages/FamilyPage';
import AllAlarmsPage from '@/pages/AllAlarmsPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 } },
});

function MainLayout() {
  useEffect(() => {
    const fontSize = localStorage.getItem('display_fontSize') || 'medium';
    document.body.setAttribute('data-fontsize', fontSize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <BottomNav />
      <main className="pt-32 px-8 w-full max-w-6xl mx-auto">
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
