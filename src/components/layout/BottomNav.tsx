// 상단 네비게이션 바 (데스크톱 웹 스타일)
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export function BottomNav() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
      <div className="w-full px-8 h-28 flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center gap-8">
          <img src="/logo.png" alt="link26" className="h-24 w-auto" />

          {/* 메뉴 */}
          <nav className="flex items-center gap-1">
            {[
              { to: '/',        label: '홈' },
              { to: '/chat',    label: 'AI 채팅' },
              { to: '/family',  label: '가족 계정' },
              { to: '/more',    label: '더보기' }
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'px-6 py-3 rounded-lg text-lg font-semibold transition-colors',
                    isActive
                      ? 'bg-blue-50 text-[#0B6BFF]'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 우측 로고 */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="link26" className="h-16 w-auto" />
        </div>
      </div>
    </header>
  );
}
