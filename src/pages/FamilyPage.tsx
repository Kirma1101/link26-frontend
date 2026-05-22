import { useState } from 'react';
import { t } from '@/i18n';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyApi } from '@/api';
import { Spinner, Avatar } from '@/components/ui';
import type { FamilyMember } from '@/types';

export default function FamilyPage() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', relation: '', phone: '' });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['family'],
    queryFn: () => familyApi.list().then(r => r.data),
  });

  const addMember = useMutation({
    mutationFn: () => familyApi.add(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['family'] });
      setShowAdd(false);
      setForm({ name: '', relation: '', phone: '' });
    },
  });

  return (
    <div className="py-8 w-full px-4 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800">{t('family_title')}</h1>
          <p className="text-slate-500 mt-1">{t('family_subtitle')}</p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="bg-[#0B6BFF] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          + 구성원 추가
        </button>
      </div>

      {/* 추가 폼 */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h3 className="font-black text-slate-700 mb-4">{t('family_add').replace('+  ', '')}</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {(['name', 'relation', 'phone'] as const).map(k => (
              <div key={k}>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">
                  {{ name: t('family_name'), relation: t('family_relation'), phone: t('family_phone') }[k]}
                </label>
                <input
                  value={form[k]}
                  onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAdd(false)}
              className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm"
            >
              취소
            </button>
            <button
              onClick={() => addMember.mutate()}
              disabled={!form.name || addMember.isPending}
              className="px-5 py-2 rounded-xl bg-[#0B6BFF] text-white font-bold text-sm disabled:opacity-50"
            >
              {addMember.isPending ? '추가 중...' : '추가하기'}
            </button>
          </div>
        </div>
      )}

      {/* 구성원 목록 */}
      {isLoading ? (
        <Spinner className="py-10" />
      ) : members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <p className="text-slate-400 mb-3">등록된 가족 구성원이 없습니다.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="text-blue-600 font-semibold text-sm"
          >
            + 첫 번째 구성원 추가하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {members.map((m: FamilyMember) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
              <Avatar text={m.avatarText} size="lg" />
              <div>
                <p className="font-black text-slate-800 text-lg">{m.name}</p>
                <p className="text-sm text-slate-400">{m.relation}</p>
                <p className="text-sm text-slate-500 mt-1">{m.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

