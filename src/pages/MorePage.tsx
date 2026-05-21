// src/pages/MorePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyApi, settingsApi } from '@/api';
import { Card, Spinner, Avatar } from '@/components/ui';
import type { FamilyMember, NotificationSettings } from '@/types';

type Panel = 'none' | 'family' | 'notifications' | 'display' | 'help';
type FontSize = 'small' | 'medium' | 'large';
type Layout = 'comfortable' | 'compact' | 'responsive';

// 전역 표시 설정 적용 함수
function applyDisplaySettings(fontSize: FontSize, layout: Layout) {
  const root = document.documentElement;
  // 글자 크기
  const sizeMap = { small: '14px', medium: '16px', large: '18px' };
  root.style.setProperty('--app-font-size', sizeMap[fontSize]);
  document.body.style.fontSize = sizeMap[fontSize];
  // 레이아웃
  const maxWidthMap = { comfortable: '900px', compact: '700px', responsive: '100%' };
  root.style.setProperty('--app-max-width', maxWidthMap[layout]);
  // localStorage 저장
  localStorage.setItem('display_fontSize', fontSize);
  localStorage.setItem('display_layout', layout);
}

// 앱 시작 시 저장된 설정 불러오기
export function initDisplaySettings() {
  const fontSize = (localStorage.getItem('display_fontSize') as FontSize) || 'medium';
  const layout = (localStorage.getItem('display_layout') as Layout) || 'comfortable';
  applyDisplaySettings(fontSize, layout);
}

export default function MorePage() {
  const [panel, setPanel] = useState<Panel>('none');
  const navigate = useNavigate();
  const toggle = (p: Panel) => setPanel(prev => prev === p ? 'none' : p);

  return (
    <div className="flex flex-col w-full pb-10 px-8">
      {/* 로고 헤더 */}
      <div className="bg-[#EAF3FF] rounded-2xl p-6 text-center mb-5">
        <p className="text-3xl font-black text-[#1E4E8C] leading-tight">
          link26<br />
          <span className="text-sm font-normal tracking-widest">— LINK FOR HEALTH —</span>
        </p>
      </div>

      <h2 className="text-2xl font-black text-slate-800 mb-4">더보기</h2>

      {/* APK 다운로드 배너 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 mb-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
          <div>
            <p className="font-black text-white text-sm">link26 앱 다운로드</p>
            <p className="text-xs text-blue-100">Android APK · 최신 버전</p>
          </div>
        </div>
        <a href="/link26.apk" download="link26.apk"
          className="bg-white text-blue-600 font-black text-sm px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap">
          다운로드
        </a>
      </div>

      {/* 메뉴 목록 */}
      <div className="flex flex-col gap-2 mb-4">
        <MenuItem icon={<PeopleIcon />} title="가족 계정" subtitle="가족 구성원 관리" onTap={() => toggle('family')} active={panel === 'family'} />
        <MenuItem icon={<BellIcon />} title="알림" subtitle="복약 알림 확인" onTap={() => navigate('/alarms')} active={false} />
        <MenuItem icon={<BellIcon />} title="알림 설정" subtitle="전화/푸시 알림 설정" onTap={() => toggle('notifications')} active={panel === 'notifications'} />
        <MenuItem icon={<TextIcon />} title="표시 설정" subtitle="글자 크기, 화면 구성" onTap={() => toggle('display')} active={panel === 'display'} />
        <MenuItem icon={<HelpIcon />} title="도움말" subtitle="사용 가이드 및 FAQ" onTap={() => toggle('help')} active={panel === 'help'} />
      </div>

      {panel === 'family' && <FamilyPanel />}
      {panel === 'notifications' && <NotificationsPanel />}
      {panel === 'display' && <DisplayPanel />}
      {panel === 'help' && <HelpPanel />}
    </div>
  );
}

function MenuItem({ icon, title, subtitle, onTap, active }: {
  icon: React.ReactNode; title: string; subtitle: string; onTap: () => void; active?: boolean;
}) {
  return (
    <button onClick={onTap}
      className={`rounded-2xl border p-4 flex items-center gap-3 text-left w-full transition-colors ${active ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={`font-black text-sm ${active ? 'text-blue-700' : 'text-slate-800'}`}>{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      <svg className={`w-4 h-4 transition-transform ${active ? 'rotate-90 text-blue-400' : 'text-slate-300'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

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
            <input key={k} value={form[k]}
              onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
              placeholder={{ name: '이름', relation: '관계 (예: 어머니)', phone: '전화번호' }[k]}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          ))}
          <button onClick={() => addMember.mutate()} disabled={!form.name || addMember.isPending}
            className="h-10 rounded-xl bg-blue-600 text-white font-bold text-sm disabled:opacity-50">
            {addMember.isPending ? '추가 중...' : '추가'}
          </button>
        </div>
      )}
    </Card>
  );
}

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

  const toggle = (key: keyof NotificationSettings) => update.mutate({ ...data, [key]: !data[key] });
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
            <button onClick={() => toggle(key)}
              className={`w-11 h-6 rounded-full transition-colors ${data[key] ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data[key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DisplayPanel() {
  const [fontSize, setFontSize] = useState<FontSize>(
    (localStorage.getItem('display_fontSize') as FontSize) || 'medium'
  );
  const [layout, setLayout] = useState<Layout>(
    (localStorage.getItem('display_layout') as Layout) || 'comfortable'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    applyDisplaySettings(fontSize, layout);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: 'small', label: '작게 (14px)' },
    { value: 'medium', label: '보통 (16px)' },
    { value: 'large', label: '크게 (18px)' },
  ];

  const layouts: { value: Layout; label: string; desc: string; icon: React.ReactNode }[] = [
    { value: 'comfortable', label: '여유 있게', desc: '넓은 간격, 편안한 읽기', icon: <ComfortIcon /> },
    { value: 'compact', label: '컴팩트', desc: '좁은 간격, 많은 정보', icon: <CompactIcon /> },
    { value: 'responsive', label: '반응형', desc: '화면 크기에 맞게 자동 조절', icon: <ResponsiveIcon /> },
  ];

  return (
    <Card className="mb-4">
      <h3 className="font-black text-slate-700 mb-4">표시 설정</h3>

      {/* 글자 크기 */}
      <div className="mb-5">
        <p className="text-sm font-bold text-slate-600 mb-2">글자 크기</p>
        <div className="flex gap-2">
          {fontSizes.map(({ value, label }) => (
            <button key={value} onClick={() => setFontSize(value)}
              className={`flex-1 py-3 rounded-xl border-2 transition-all ${fontSize === value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
              <span className={`text-sm font-semibold ${fontSize === value ? 'text-blue-700' : 'text-slate-600'}`}>{label}</span>
            </button>
          ))}
        </div>
        {/* 미리보기 */}
        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p style={{ fontSize: fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px' }} className="text-slate-700">
            미리보기: 건강한 하루를 시작하세요
          </p>
        </div>
      </div>

      {/* 화면 레이아웃 */}
      <div className="mb-4">
        <p className="text-sm font-bold text-slate-600 mb-2">화면 레이아웃</p>
        <div className="flex flex-col gap-2">
          {layouts.map(({ value, label, desc, icon }) => (
            <button key={value} onClick={() => setLayout(value)}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${layout === value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${layout === value ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                {icon}
              </div>
              <div>
                <p className={`text-sm font-bold ${layout === value ? 'text-blue-700' : 'text-slate-700'}`}>{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              {layout === value && (
                <svg className="w-5 h-5 text-blue-500 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave}
        className={`w-full h-10 rounded-xl font-bold text-sm transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
        {saved ? '✓ 저장되었습니다!' : '저장'}
      </button>
    </Card>
  );
}

function HelpPanel() {
  const [tab, setTab] = useState<'faq' | 'privacy'>('faq');

  const faqs = [
    { q: '약을 어떻게 등록하나요?', a: '홈 화면에서 "+ 약 추가하기" 버튼을 눌러 약 이름, 용량, 복용 횟수를 입력하세요.' },
    { q: 'AI 채팅은 어떻게 사용하나요?', a: 'AI 채팅 탭에서 약 이름이나 증상을 입력하면 AI 건강 도우미가 정보를 제공합니다.' },
    { q: '가족 계정은 어떻게 추가하나요?', a: '더보기 > 가족 계정에서 가족 구성원의 이름, 관계, 전화번호를 입력해 추가할 수 있습니다.' },
    { q: '알림은 어떻게 설정하나요?', a: '더보기 > 알림 설정에서 전체 알림, 메시지 알림, 가족 알림, 전화 알림을 개별 설정할 수 있습니다.' },
    { q: '앱은 어디서 다운로드 하나요?', a: '더보기 화면 상단의 "link26 앱 다운로드" 버튼을 눌러 Android APK를 다운로드하세요.' },
    { q: 'AI 답변이 의료 조언인가요?', a: 'AI 답변은 참고용 정보이며 의료 조언이 아닙니다. 심각한 증상은 반드시 병원을 방문하세요.' },
  ];

  return (
    <Card className="mb-4">
      <div className="flex gap-2 mb-4">
        {[{ value: 'faq', label: '사용 가이드 (FAQ)' }, { value: 'privacy', label: '개인정보 처리방침' }].map(({ value, label }) => (
          <button key={value} onClick={() => setTab(value as 'faq' | 'privacy')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${tab === value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'faq' && (
        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
        </div>
      )}

      {tab === 'privacy' && (
        <div className="flex flex-col gap-4 text-sm text-slate-600">
          {[
            { title: '1. 수집하는 개인정보', content: 'link26은 서비스 제공을 위해 이름, 이메일, 복약 정보, 가족 구성원 정보를 수집합니다.' },
            { title: '2. 개인정보 이용 목적', content: '수집된 정보는 복약 관리, 알림 서비스, AI 건강 상담 서비스 제공에만 사용됩니다.' },
            { title: '3. 개인정보 보유 기간', content: '회원 탈퇴 시 즉시 삭제되며, 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.' },
            { title: '4. 제3자 제공', content: '사용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, AI 서비스 제공을 위해 Google Gemini API가 사용됩니다.' },
            { title: '5. 문의', content: '개인정보 관련 문의: link26.health@gmail.com' },
          ].map(({ title, content }) => (
            <div key={title}>
              <p className="font-black text-slate-800 mb-1">{title}</p>
              <p>{content}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-3 text-left bg-white">
        <span className="text-sm font-bold text-slate-700">{q}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="px-3 pb-3 bg-slate-50"><p className="text-sm text-slate-600">{a}</p></div>}
    </div>
  );
}

const PeopleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx={9} cy={7} r={4} /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;
const BellIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>;
const TextIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M4 12h16M4 18h7" /></svg>;
const HelpIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={10} /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" /></svg>;
const ComfortIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={3} width={18} height={18} rx={2} /><path d="M3 9h18M3 15h18" /></svg>;
const CompactIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M3 10h18M3 14h18M3 18h18" /></svg>;
const ResponsiveIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={2} y={3} width={20} height={14} rx={2} /><path d="M8 21h8M12 17v4" /></svg>;





