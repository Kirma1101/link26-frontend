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

function getLayout() {
  return localStorage.getItem('display_layout') || 'comfortable';
}

function getMaxWidth() {
  const layout = getLayout();
  if (layout === 'responsive') return '100%';
  if (layout === 'compact') return '700px';
  return '900px';
}

function getPadding() {
  const layout = getLayout();
  if (layout === 'responsive') return '0 24px';
  return '0';
}

function MainLayout() {
  useEffect(() => {
    const fontSize = localStorage.getItem('display_fontSize') || 'medium';
    const sizeMap: Record<string, string> = { small: '14px', medium: '16px', large: '18px' };
    document.body.style.fontSize = sizeMap[fontSize];
  }, []);

  const layout = getLayout();
  const maxWidth = getMaxWidth();
  const padding = getPadding();

  return (
    <div className="min-h-screen bg-slate-50">
      <BottomNav />
      <main
        className="pt-28"
        style={{
          maxWidth: layout === 'responsive' ? '100%' : maxWidth,
          margin: layout === 'responsive' ? '0' : '0 auto',
          padding: padding,
          width: '100%',
        }}
      >
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
