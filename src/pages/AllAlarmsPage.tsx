import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/api';
import { Spinner } from '@/components/ui';
import { clsx } from 'clsx';
import type { Alarm } from '@/types';

type Filter = '전체' | '알림' | '전화' | '복용 완료';
const FILTERS: Filter[] = ['전체', '알림', '전화', '복용 완료'];

export default function AllAlarmsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('전체');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => homeApi.dashboard().then(r => r.data),
  });

  const alarms = data?.alarms ?? [];

  const filtered = alarms.filter(a => {
    if (filter === '전체') return true;
    if (filter === '알림') return a.type === 'app';
    if (filter === '전화') return a.type === 'call';
    if (filter === '복용 완료') return a.status === '복용 완료';
    return true;
  });

  const grouped = filtered.reduce<Record<string, Alarm[]>>((acc, alarm) => {
    const key = alarm.dateLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push(alarm);
    return acc;
  }, {});

  const dateLabel = `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 (${['일','월','화','수','목','금','토'][selectedDate.getDay()]})`;

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-xl font-black text-slate-800">전체 알림</h1>
      </div>

      <div className="flex items-center gap-2 px-5 mb-4 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors flex-shrink-0',
              filter === f ? 'bg-[#0B6BFF] text-white' : 'bg-white text-slate-500 border border-slate-200'
            )}
          >
            {f}
          </button>
        ))}
        <button
          onClick={() => setShowCalendar(v => !v)}
          className={clsx(
            'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors',
            showCalendar ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'
          )}
        >
          <svg className={clsx('w-4 h-4', showCalendar ? 'text-white' : 'text-slate-500')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x={3} y={4} width={18} height={18} rx={2}/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        </button>
      </div>

      {showCalendar && (
        <div className="mx-5 mb-4">
          <MiniCalendar selected={selectedDate} onChange={d => { setSelectedDate(d); setShowCalendar(false); }} />
        </div>
      )}

      {isLoading ? <Spinner className="py-10" /> : (
        <div className="px-5">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-center text-slate-400 py-16">해당하는 알림이 없습니다.</p>
          ) : (
            Object.entries(grouped).map(([date, items]) => (
              <div key={date} className="mb-4">
                <p className="text-sm font-semibold text-slate-400 mb-3">{date || dateLabel}</p>
                <div className="flex flex-col gap-3">
                  {items.map(alarm => (
                    <AlarmCard key={alarm.id} alarm={alarm} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function AlarmCard({ alarm }: { alarm: Alarm }) {
  const isDone = alarm.status === '복용 완료';
  const isCall = alarm.type === 'call';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#EAF3FF] flex items-center justify-center flex-shrink-0">
        {isCall ? (
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-black text-slate-800">{alarm.time}</span>
          <span className={clsx(
            'text-xs font-bold px-2 py-0.5 rounded-full',
            isCall ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          )}>
            {isCall ? '전화' : '알림'}
          </span>
        </div>
        <p className="text-sm text-slate-500">{alarm.medicineName} {alarm.dose}</p>
      </div>

      {isDone ? (
        <span className="text-sm text-blue-500 font-semibold">√ 완료</span>
      ) : (
        <button className="bg-[#0B6BFF] text-white text-sm font-bold px-3 py-2 rounded-xl">
          복용 완료
        </button>
      )}
    </div>
  );
}

function MiniCalendar({ selected, onChange }: { selected: Date; onChange: (d: Date) => void }) {
  const [view, setView] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSelected = (d: number) =>
    selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === d;

  const isToday = (d: number) => {
    const t = new Date();
    return t.getFullYear() === year && t.getMonth() === month && t.getDate() === d;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setView(new Date(year, month - 1, 1))} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span className="font-black text-slate-800">{year}년 {month + 1}월</span>
        <button onClick={() => setView(new Date(year, month + 1, 1))} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {['일','월','화','수','목','금','토'].map(d => (
          <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center">
            {d ? (
              <button
                onClick={() => onChange(new Date(year, month, d))}
                className={clsx(
                  'w-8 h-8 rounded-full text-sm font-semibold transition-colors',
                  isSelected(d) && 'bg-[#0B6BFF] text-white',
                  !isSelected(d) && isToday(d) && 'border-2 border-blue-400 text-blue-600',
                  !isSelected(d) && !isToday(d) && 'text-slate-700 hover:bg-slate-100',
                )}
              >
                {d}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}