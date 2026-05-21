import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export function BottomNav() {
  return (
    <>
      {/* 데스크톱 상단 네비게이션 */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src="/logo.png" alt="link26" className="h-10 w-auto" />
            <nav className="flex items-center gap-1">
              {[
                { to: '/', label: '홈' },
                { to: '/chat', label: 'AI 채팅' },
                { to: '/family', label: '가족 계정' },
                { to: '/more', label: '더보기' }
              ].map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'}
                  className={({ isActive }) => clsx(
                    'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                    isActive ? 'bg-[#EAF3FF] text-[#1E6FBF]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  )}>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* 모바일 상단 로고바 */}
      <header className="flex md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 h-14 items-center px-4">
        <img src="/logo.png" alt="link26" className="h-12 w-auto" />
      </header>

      {/* 모바일 하단 탭바 */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 h-16">
        {[
          { to: '/', label: '홈', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { to: '/chat', label: 'AI 채팅', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
          { to: '/family', label: '가족', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
          { to: '/more', label: '더보기', icon: 'M4 6h16M4 12h16M4 18h16' },
        ].map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => clsx(
              'flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors',
              isActive ? 'text-[#1E6FBF]' : 'text-slate-400'
            )}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

