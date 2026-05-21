import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export function BottomNav() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
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
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-[#EAF3FF] text-[#1E6FBF]'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
