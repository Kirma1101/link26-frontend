// src/pages/SignupPage.tsx
// Flutter signup_screen.dart (agreePrivacy, agreeSensitive, agreeThirdParty) 재현
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PrimaryButton, Input } from '@/components/ui';
import { clsx } from 'clsx';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', password: '', passwordCheck: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Flutter 동의 항목 그대로
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeSensitive, setAgreeSensitive] = useState(false);
  const [agreeThirdParty, setAgreeThirdParty] = useState(false);

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAgreeAll = (v: boolean) => {
    setAgreeAll(v);
    setAgreePrivacy(v);
    setAgreeSensitive(v);
    setAgreeThirdParty(v);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '이름을 입력해주세요.';
    if (!form.email.includes('@')) e.email = '올바른 이메일 형식이 아닙니다.';
    if (form.password.length < 6) e.password = '비밀번호는 6자 이상이어야 합니다.';
    if (form.password !== form.passwordCheck) e.passwordCheck = '비밀번호가 일치하지 않습니다.';
    if (!agreePrivacy || !agreeSensitive) e.agree = '필수 항목에 동의해주세요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await signup(form.name.trim(), form.email.trim(), form.password);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        ?? '회원가입에 실패했습니다.';
      setErrors(prev => ({ ...prev, general: msg }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-black text-center text-[#0B6BFF] mb-2">link26</h1>
        <p className="text-center text-slate-500 font-semibold mb-8">건강 관리 계정 만들기</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="이름" value={form.name} onChange={setField('name')} placeholder="홍길동" error={errors.name} />
          <Input label="이메일" type="email" value={form.email} onChange={setField('email')} placeholder="example@email.com" error={errors.email} />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-600">비밀번호</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={setField('password')}
                placeholder="6자 이상"
                className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                {showPw ? '숨기기' : '보기'}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <Input
            label="비밀번호 확인"
            type={showPw ? 'text' : 'password'}
            value={form.passwordCheck}
            onChange={setField('passwordCheck')}
            placeholder="비밀번호 재입력"
            error={errors.passwordCheck}
          />

          {/* 동의 항목 — Flutter signup_screen.dart 그대로 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
            <CheckRow
              label="전체 동의"
              checked={agreeAll}
              onChange={handleAgreeAll}
              bold
            />
            <hr className="border-slate-100" />
            <CheckRow label="(필수) 개인정보 처리방침" checked={agreePrivacy} onChange={setAgreePrivacy} />
            <CheckRow label="(필수) 민감정보 수집 동의" checked={agreeSensitive} onChange={setAgreeSensitive} />
            <CheckRow label="(선택) 제3자 제공 동의" checked={agreeThirdParty} onChange={setAgreeThirdParty} />
          </div>
          {errors.agree && <p className="text-xs text-red-500">{errors.agree}</p>}

          {errors.general && (
            <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl py-2">{errors.general}</p>
          )}

          <PrimaryButton type="submit" loading={isLoading} className="mt-2">
            회원가입
          </PrimaryButton>

          <Link to="/login" className="text-center text-sm text-slate-500 py-1">
            이미 계정이 있나요? <span className="text-blue-600 font-semibold">로그인</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

function CheckRow({ label, checked, onChange, bold }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; bold?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={clsx(
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
          checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
        )}
      >
        {checked && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>}
      </div>
      <span className={clsx('text-sm text-slate-700', bold && 'font-bold')}>{label}</span>
    </label>
  );
}
