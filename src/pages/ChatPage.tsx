// src/pages/ChatPage.tsx
// Flutter ai_chat_screen.dart 의 웹 버전
import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/api';
import { clsx } from 'clsx';
import type { ChatMessage } from '@/types';

let msgId = 0;
const newId = () => String(++msgId);

const fmt = () => {
  const t = new Date();
  return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: newId(), isUser: false, time: fmt(),
      text: '안녕하세요! AI 건강 도우미입니다.\n약 이름을 입력하거나 궁금한 점을 물어보세요.',
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: (msg: string) => aiApi.chat(msg).then(r => r.data.answer),
    onSuccess: (answer) => {
      setMessages(prev => [...prev, { id: newId(), isUser: false, time: fmt(), text: answer }]);
    },
  });

  const send = () => {
    const text = input.trim();
    if (!text || chatMutation.isPending) return;
    setMessages(prev => [...prev, { id: newId(), isUser: true, time: fmt(), text }]);
    setInput('');
    chatMutation.mutate(text);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessages(prev => [
      ...prev,
      { id: newId(), isUser: true, time: fmt(), text: '사진을 선택했습니다.' },
    ]);
    // 처방전 분석 (텍스트 추출은 추후 OCR API 연결)
    const { data } = await aiApi.prescription('분석 요청');
    setMessages(prev => [
      ...prev,
      {
        id: newId(), isUser: false, time: fmt(),
        text: `${data.productName}\n\n${data.recommendation}\n${data.reason}`,
      },
    ]);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full">
      {/* 헤더 */}
      <div className="bg-[#F8FAFF] border-b border-slate-100 px-5 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-black text-slate-800 text-sm">AI 건강 도우미</p>
          <p className="text-xs text-slate-400">약 추천 · 처방전 분석</p>
        </div>
        <button
          onClick={() => setMessages([{ id: newId(), isUser: false, time: fmt(), text: '새 대화를 시작합니다.' }])}
          className="text-xs text-blue-600 font-semibold border border-blue-200 px-3 py-1 rounded-full"
        >
          + 새 대화
        </button>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#F8FAFF]">
        {messages.map(m => (
          <Bubble key={m.id} msg={m} />
        ))}
        {chatMutation.isPending && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            AI 분석 중...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="bg-white border-t border-slate-100 px-4 py-3 pb-20">
        <div className="flex items-center gap-2">
          {/* 이미지 업로드 버튼 */}
          <label className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center cursor-pointer flex-shrink-0">
            <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx={12} cy={13} r={4}/>
            </svg>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="약 이름을 입력하세요..."
            className="flex-1 h-11 rounded-3xl border border-slate-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            onClick={send}
            disabled={!input.trim() || chatMutation.isPending}
            className="w-10 h-10 rounded-full bg-[#0B6BFF] flex items-center justify-center disabled:opacity-40 flex-shrink-0"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.isUser;
  return (
    <div className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={clsx(
        'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
        isUser
          ? 'bg-[#0B6BFF] text-white rounded-br-sm'
          : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
      )}>
        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
        <p className={clsx('text-xs mt-1', isUser ? 'text-blue-200' : 'text-slate-400')}>{msg.time}</p>
      </div>
    </div>
  );
}
