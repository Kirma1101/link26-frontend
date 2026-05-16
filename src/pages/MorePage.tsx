// src/pages/MorePage.tsx
// Flutter more_screen.dart 재현 — 프로필, 가족 계정, 알림 설정, 표시 설정, 도움말
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyApi, settingsApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { Card, Spinner, Avatar } from '@/components/ui';
import type { FamilyMember, NotificationSettings } from '@/types';

export default function MorePage() {
  const { user, logout } = useAuthStore();
  const [panel, setPanel] = useState<'none' | 'family' | 'notifications'>('none');

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* 로고 헤더 — Flutter more_screen.dart 상단 배너 */}
      <div className="bg-[#EAF3FF] rounded-2xl p-6 text-center mb-5">
        <p className="text-3xl font-black text-[#1E4E8C] leading-tight">
          link26<br />
          <span className="text-sm font-normal tracking-widest">— LINK FOR HEALTH —</span>
        </p>
      </div>

      <h2 className="text-2xl font-black text-slate-800 mb-4">더보기</h2>

      {/* 프로필 카드 */}
      <Card className="flex items-center gap-4 mb-4">
        <Avatar text={(user?.name?.[0] ?? 'U')} size="lg" />
        <div>
          <p className="font-black text-lg text-slate-800">{user?.name ?? '사용자'}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </Card>

      {/* 메뉴 목록 */}
      <div className="flex flex-col gap-2 mb-4">
        <MenuItem icon={<PeopleIcon />} title="가족 계정" subtitle="가족 구성원 관리" onTap={() => setPanel(p => p === 'family' ? 'none' : 'family')} />
        <MenuItem icon={<BellIcon />} title="알림 설정" subtitle="전화/푸시 알림 설정" onTap={() => setPanel(p => p === 'notifications' ? 'none' : 'notifications')} />
        <MenuItem icon={<TextIcon />} title="표시 설정" subtitle="글자 크기, 화면 구성" onTap={() => {}} />
        <MenuItem icon={<HelpIcon />} title="도움말" subtitle="사용 가이드 및 FAQ" onTap={() => {}} />
      </div>

      {/* 인라인 패널 */}
      {panel === 'family' && <FamilyPanel />}
      {panel === 'notifications' && <NotificationsPanel />}

      {/* 로그아웃 */}
      <button
        onClick={() => logout()}
        className="w-full mt-4 h-12 rounded-2xl border border-slate-200 text-slate-500 font-semibold text-sm"
      >
        로그아웃
      </button>
    </div>
  );
}

// ── 메뉴 타일 ──────────────────────────────────────
function MenuItem({ icon, title, subtitle, onTap }: {
  icon: React.ReactNode; title: string; subtitle: string; onTap: () => void;
}) {
  return (
    <button
      onClick={onTap}
      className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 text-left w-full"
    >
      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-black text-slate-800 text-sm">{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  );
}

// ── 가족 계정 패널 ─────────────────────────────────
function FamilyPanel() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', relation: '', phone: '' });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['family'],
    queryFn: () => familyApi.list().then(r => r.data),
  });

  const addMember = useMutation({
    mutationFn: () => familyApi.add(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['family'] }); setShowAdd(false); setForm({ name: '', relation: '', phone: '' }); },
  });

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-slate-700">가족 구성원</h3>
        <button onClick={() => setShowAdd(v => !v)} className="text-xs text-blue-600 font-semibold">+ 추가</button>
      </div>

      {isLoading ? <Spinner className="py-4" /> : (
        <div className="flex flex-col gap-2">
          {members.map((m: FamilyMember) => (
            <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
              <Avatar text={m.avatarText} size="sm" />
              <div>
                <p className="font-semibold text-sm">{m.name}</p>
                <p className="text-xs text-slate-400">{m.relation} · {m.phone}</p>
              </div>
            </div>
          ))}
          {members.length === 0 && !showAdd && (
            <p className="text-sm text-slate-400 text-center py-2">등록된 가족이 없습니다.</p>
          )}
        </div>
      )}

      {showAdd && (
        <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-slate-100">
          {(['name', 'relation', 'phone'] as const).map(k => (
            <input
              key={k}
              value={form[k]}
              onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
              placeholder={{ name: '이름', relation: '관계 (예: 어머니)', phone: '전화번호' }[k]}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          ))}
          <button
            onClick={() => addMember.mutate()}
            disabled={!form.name || addMember.isPending}
            className="h-10 rounded-xl bg-blue-600 text-white font-bold text-sm disabled:opacity-50"
          >
            {addMember.isPending ? '추가 중...' : '추가'}
          </button>
        </div>
      )}
    </Card>
  );
}

// ── 알림 설정 패널 ─────────────────────────────────
function NotificationsPanel() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => settingsApi.getNotifications().then(r => r.data),
  });

  const update = useMutation({
    mutationFn: (s: NotificationSettings) => settingsApi.updateNotifications(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  if (isLoading || !data) return <Spinner className="py-4" />;

  const toggle = (key: keyof NotificationSettings) => {
    update.mutate({ ...data, [key]: !data[key] });
  };

  const labels: Record<keyof NotificationSettings, string> = {
    all: '전체 알림', message: '메시지 알림', family: '가족 알림', phone: '전화 알림',
  };

  return (
    <Card className="mb-4">
      <h3 className="font-black text-slate-700 mb-3">알림 설정</h3>
      <div className="flex flex-col gap-3">
        {(Object.keys(labels) as Array<keyof NotificationSettings>).map(key => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">{labels[key]}</span>
            <button
              onClick={() => toggle(key)}
              className={`w-11 h-6 rounded-full transition-colors ${data[key] ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data[key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// 아이콘
const PeopleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const BellIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;
const TextIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M4 12h16M4 18h7"/></svg>;
const HelpIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={10}/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>;
