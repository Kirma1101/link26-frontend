// src/pages/LoginPage.tsx
// Flutter login_screen.dart 를 React로 — UI/UX 동일하게 재현
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PrimaryButton, Input } from '@/components/ui';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = '이메일을 입력해주세요.';
    else if (!email.includes('@')) e.email = '올바른 이메일 형식이 아닙니다.';
    if (!password) e.password = '비밀번호를 입력해주세요.';
    else if (password.length < 6) e.password = '비밀번호는 6자 이상이어야 합니다.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        ?? '로그인에 실패했습니다.';
      setErrors({ general: msg });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <h1 className="text-5xl font-black text-center text-[#0B6BFF] mb-2">link26</h1>
        <p className="text-center text-slate-500 font-semibold mb-10">
          로그인하고 가족 건강 관리를 시작하세요
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="이메일"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            error={errors.email}
            icon={<MailIcon />}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-600">비밀번호</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><LockIcon /></span>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="6자 이상 입력"
                className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          {errors.general && (
            <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl py-2">{errors.general}</p>
          )}

          <PrimaryButton type="submit" loading={isLoading} className="mt-2">
            로그인
          </PrimaryButton>

          <Link to="/signup" className="text-center text-sm text-slate-500 py-2">
            계정이 없나요? <span className="text-blue-600 font-semibold">회원가입</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

// 인라인 SVG 아이콘
const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);
const LockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x={3} y={11} width={18} height={11} rx={2}/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const EyeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/>
  </svg>
);
const EyeOffIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
  </svg>
);
