// src/components/ui/index.tsx
// Flutter의 _Card, PrimaryButton, LoadingIndicator, AppTextField 등을 React로

import { type ReactNode, type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

// ── Card ── (Flutter _Card)
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-white rounded-2xl border border-[#E2E8F0] p-4', className)}>
      {children}
    </div>
  );
}

// ── PrimaryButton ──
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}
export function PrimaryButton({ loading, children, className, disabled, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      disabled={loading || disabled}
      className={clsx(
        'w-full h-14 rounded-2xl bg-[#0B6BFF] text-white font-black text-lg',
        'flex items-center justify-center gap-2',
        'disabled:opacity-60 transition-opacity',
        className
      )}
    >
      {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  );
}

// ── Input ── (Flutter TextFormField)
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}
export function Input({ label, error, icon, className, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-slate-600">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          {...rest}
          className={clsx(
            'w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-400',
            icon && 'pl-10',
            error && 'border-red-400',
            className
          )}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── SectionHeader ── (Flutter _Header)
export function SectionHeader({
  title, action, onAction,
}: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-black text-slate-800">{title}</h2>
      {action && (
        <button onClick={onAction} className="text-sm text-blue-600 font-semibold">
          {action}
        </button>
      )}
    </div>
  );
}

// ── Spinner ──
export function Spinner({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

// ── Badge ──
export function Badge({ children, color = 'blue' }: { children: ReactNode; color?: 'blue' | 'green' | 'red' | 'yellow' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', colors[color])}>
      {children}
    </span>
  );
}

// ── Avatar ──
export function Avatar({ text, size = 'md' }: { text: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl' };
  return (
    <div className={clsx('rounded-full bg-[#EAF3FF] flex items-center justify-center font-bold text-blue-600', sizes[size])}>
      {text}
    </div>
  );
}
