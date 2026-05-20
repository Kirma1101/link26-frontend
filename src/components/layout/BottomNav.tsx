import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export function BottomNav() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
      <div className="w-full px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <img src="/logo.png" alt="link26" className="h-12 w-auto" />
          <nav className="flex items-center gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/chat', label: 'AI Chat' },
              { to: '/family', label: 'Family' },
              { to: '/more', label: 'More' }
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'px-5 py-2 rounded-lg text-base font-semibold transition-colors',
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
        <img src="/logo.png" alt="link26" className="h-10 w-auto" />
      </div>
    </header>
  );
}
