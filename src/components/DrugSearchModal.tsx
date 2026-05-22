// src/components/DrugSearchModal.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

interface DrugResult {
  id: string;
  name: string;
  company: string;
  effect: string;
  usage: string;
  caution: string;
  sideEffect: string;
  storage: string;
  image: string;
}

export function DrugSearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DrugResult | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['drug-search', query],
    queryFn: () => api.get<{ results: DrugResult[] }>(`/drug/search?q=${encodeURIComponent(query)}`).then(r => r.data),
    enabled: query.trim().length >= 2,
  });

  const results = data?.results ?? [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-black text-slate-800">의약품 검색</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="약 이름을 입력하세요 (예: 타이레놀)"
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">식품의약품안전처 공식 데이터 기반</p>
        </div>

        {/* 결과 */}
        <div className="flex-1 overflow-y-auto">
          {selected ? (
            <DrugDetail drug={selected} onBack={() => setSelected(null)} />
          ) : (
            <div className="p-4">
              {query.trim().length < 2 && (
                <p className="text-center text-slate-400 text-sm py-8">2글자 이상 입력하세요</p>
              )}
              {(isLoading || isFetching) && query.trim().length >= 2 && (
                <p className="text-center text-slate-400 text-sm py-8">검색 중...</p>
              )}
              {!isLoading && !isFetching && query.trim().length >= 2 && results.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-8">검색 결과가 없습니다</p>
              )}
              {results.map(drug => (
                <button key={drug.id} onClick={() => setSelected(drug)}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all mb-2">
                  <p className="font-semibold text-slate-800 text-sm">{drug.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{drug.company}</p>
                  {drug.effect && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{drug.effect}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DrugDetail({ drug, onBack }: { drug: DrugResult; onBack: () => void }) {
  const sections = [
    { label: '효능·효과', value: drug.effect },
    { label: '사용법', value: drug.usage },
    { label: '주의사항', value: drug.caution },
    { label: '부작용', value: drug.sideEffect },
    { label: '보관법', value: drug.storage },
  ].filter(s => s.value);

  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center gap-1 text-blue-600 text-sm font-semibold mb-4">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
        목록으로
      </button>

      <div className="mb-4">
        <h4 className="text-lg font-black text-slate-800">{drug.name}</h4>
        <p className="text-sm text-slate-400">{drug.company}</p>
      </div>

      {sections.map(({ label, value }) => (
        <div key={label} className="mb-4 p-3 bg-slate-50 rounded-xl">
          <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide">{label}</p>
          <p className="text-sm text-slate-700 leading-relaxed">{value}</p>
        </div>
      ))}
    </div>
  );
}
