import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import MorePage from '@/pages/MorePage';
import FamilyPage from '@/pages/FamilyPage';
import AllAlarmsPage from '@/pages/AllAlarmsPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 } },
});

function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col py-6 px-4 flex-shrink-0">
      <div className="text-sm font-bold text-slate-400 px-3 mb-3 tracking-wider uppercase">메뉴</div>
      {[
        { to: '/', label: '홈', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { to: '/chat', label: 'AI 채팅', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { to: '/family', label: '가족 계정', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
        { to: '/more', label: '더보기', icon: 'M4 6h16M4 12h16M4 18h16' },
      ].map(({ to, label, icon }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) => clsx(
            'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors mb-1',
            isActive ? 'bg-[#EAF3FF] text-[#1E6FBF] font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          )}>
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
          {label}
        </NavLink>
      ))}
    </aside>
  );
}

function MainLayout() {
  useEffect(() => {
  const size = localStorage.getItem('display_fontSize_size');
  if (size) {
    document.body.style.fontSize = size + 'px';
  }
}, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
      <BottomNav />
      <div className="flex flex-1 pt-28 md:pt-16 pb-16 md:pb-0">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
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




