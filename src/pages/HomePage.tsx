import { useState } from 'react';
import { DrugSearchModal } from '@/components/DrugSearchModal';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homeApi, medicinesApi } from '@/api';
import { api } from '@/api/client';
import { Card, SectionHeader, Spinner, Badge } from '@/components/ui';
import type { Alarm, Medication } from '@/types';

export default function HomePage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDrugSearch, setShowDrugSearch] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => homeApi.dashboard().then(r => r.data),
  });


  const deleteMed = useMutation({
    mutationFn: (id: string) => medicinesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard'] }),
  });

  const completeAlarm = useMutation({
  mutationFn: (id: string) => api.patch(`/alarms/${id}/complete`),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard'] }),
});

  if (isLoading) return <Spinner className="h-96" />;

  const alarms = data?.alarms ?? [];
  const medications = (data?.medications ?? []).filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  const pending = alarms.filter(a => a.status === '예정');
  const completed = alarms.filter(a => a.status === '복용 완료');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-8 overflow-x-hidden">
      {/* 페이지 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8 w-full">
        <div>
          <h1 className="text-3xl md:text-3xl font-black text-slate-800 leading-tight">건강한 하루를 시작하세요</h1>
          <p className="text-slate-500 mt-1">오늘의 복약 현황을 확인하세요</p>
        </div>
        <div className="relative w-full md:w-80">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx={11} cy={11} r={8}/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={() => setShowDrugSearch(true)}
            placeholder="약 이름, 성분 검색"
            className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* 통계 카드 3개 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 w-full">
        <StatCard label="오늘 복용" value={`${data?.completedCount ?? 0}/${data?.totalCount ?? 0}`} color="blue" />
        <StatCard label="등록된 약" value={`${data?.medications.length ?? 0}개`} color="green" />
        <StatCard label="예정 알람" value={`${pending.length}건`} color="orange" />
      </div>

      {/* 2컬럼 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
        {/* 좌측: 알람 (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 오늘의 알람 */}
          {pending.length > 0 && (
            <section>
              <SectionHeader title="오늘의 알림" action="전체보기" onAction={() => navigate('/alarms')} />
              <div className="flex flex-col gap-3">
                {pending.map(alarm => (
                  <AlarmCard key={alarm.id} alarm={alarm} onComplete={(id) => completeAlarm.mutate(id)} />
                ))}
              </div>
            </section>
          )}

          {/* 복용 완료 */}
          {completed.length > 0 && (
            <section>
              <SectionHeader title="복용 완료" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completed.map(alarm => (
                  <CompletedTile key={alarm.id} alarm={alarm} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 우측: 약 목록 (1/3) */}
        <div>
          <SectionHeader title="내 약 목록" action="+ 추가" onAction={() => setShowAddModal(true)} />
          {medications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
              <p className="text-slate-400 text-sm">등록된 약이 없습니다.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 text-sm text-blue-600 font-semibold"
              >
                + 약 추가하기
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {medications.map(med => (
                <MedicineTile key={med.id} med={med} onDelete={() => deleteMed.mutate(med.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && <AddMedicineModal onClose={() => setShowAddModal(false)} />}
      {showDrugSearch && <DrugSearchModal onClose={() => setShowDrugSearch(false)} />}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: 'blue' | 'green' | 'orange' }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    orange: 'from-orange-400 to-orange-500',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-5 md:p-6 text-white`}>
      <p className="text-sm font-semibold opacity-80 mb-2">{label}</p>
      <p className="text-3xl md:text-4xl font-black">{value}</p>
    </div>
  );
}

function AlarmCard({ alarm, onComplete }: { alarm: Alarm; onComplete: (id: string) => void }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-800">{alarm.time}</span>
            <Badge color="blue">알림</Badge>
          </div>
          <p className="text-sm text-slate-500">{alarm.medicineName} {alarm.dose}</p>
        </div>
        <button onClick={() => onComplete(alarm.id)} className="bg-slate-900 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors">
          복용 완료
        </button>
      </div>
    </Card>
  );
}

function CompletedTile({ alarm }: { alarm: Alarm }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500">{alarm.time}</p>
        <p className="text-sm font-semibold text-slate-700 truncate">{alarm.medicineName} {alarm.dose}</p>
      </div>
    </div>
  );
}

function MedicineTile({ med, onDelete }: { med: Medication; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-3 flex items-center gap-3 hover:border-blue-200 transition-colors">
      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{med.name}</p>
        <p className="text-xs text-slate-400">{med.dose} · {med.frequency}</p>
      </div>
      <button onClick={onDelete} className="text-slate-300 hover:text-red-400 transition-colors p-1">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  );
}

function AddMedicineModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', dose: '', frequency: '1일 1회', time: '08:00' });

  const add = useMutation({
    mutationFn: () => medicinesApi.add(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['dashboard'] }); onClose(); },
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-black mb-5">약 추가</h3>
        <div className="flex flex-col gap-3">
          {(['name', 'dose', 'frequency', 'time'] as const).map(key => (
            <div key={key}>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                {{ name: '약 이름', dose: '용량', frequency: '복용 횟수', time: '복용 시간' }[key]}
              </label>
              <input
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-600 font-semibold">취소</button>
          <button
            onClick={() => add.mutate()}
            disabled={!form.name || add.isPending}
            className="flex-1 h-11 rounded-xl bg-[#0B6BFF] text-white font-black disabled:opacity-50"
          >
            {add.isPending ? '추가 중...' : '추가하기'}
          </button>
        </div>
      </div>
    </div>
  );
}





