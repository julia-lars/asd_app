import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/common/BottomNav';

const TEXT = {
  loading: '\u52a0\u8f7d\u4e2d...',
  welcome: '\u6b22\u8fce',
  chatTitle: 'AI \u52a9\u624b',
  placeholder: '\u8f93\u5165\u4f60\u7684\u95ee\u9898...',
  send: '\u53d1\u9001',
  assistant: 'AI',
  user: '\u6211',
  hello: '\u4f60\u597d\uff0c\u6211\u662f\u4f60\u7684 AI \u52a9\u624b\u3002\u6709\u4ec0\u4e48\u6211\u53ef\u4ee5\u5e2e\u52a9\u4f60\u7684\u5417\uff1f',
  newChat: '\u65b0\u5bf9\u8bdd',
  reflectTitle: '\u957f\u671f\u8bb0\u5fc6\uff08\u8de8\u5bf9\u8bdd\uff0c\u975e\u8bca\u65ad\uff09',
  reflectDisclaimer:
    '\u4ee5\u4e0b\u7531 AI \u6839\u636e\u5386\u53f2\u5bf9\u8bdd\u5f52\u7eb3\uff0c\u4ec5\u8bb0\u5f55\u60a8\u81ea\u8ff0\u7684\u57fa\u672c\u4fe1\u606f\u4e0e\u6700\u540e\u4e00\u8f6e\u60c5\u7eea\u611f\u77e5\uff0c\u672a\u6838\u9a8c\u3001\u4e0d\u6784\u6210\u8bca\u65ad\u3002',
  reflectPoints: '\u5df2\u77e5\u80cc\u666f\u8981\u70b9',
  reflectSignals: '\u6700\u540e\u4e00\u8f6e\u60c5\u7eea\u4e0e\u652f\u6301\u9700\u6c42\uff08\u975e\u8bca\u65ad\uff09',
  reflectFailed: '\u672c\u8f6e\u5f52\u7eb3\u672a\u5b8c\u6210\uff0c\u4e0b\u8f6e\u5173\u5fc3\u8bed\u5883\u53ef\u80fd\u7f3a\u5931\u3002'
};

const AiChat = () => {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState(() => [
    { role: 'assistant', content: TEXT.hello, createdAt: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [lastReflect, setLastReflect] = useState(null);
  const [reflectOpen, setReflectOpen] = useState(true);
  const navigate = useNavigate();
  const listRef = useRef(null);

  const formatTime = (date) => {
    if (!date) return '';
    try {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const saved = sessionStorage.getItem(`ai_chat_cid_${user.uid}`);
      if (saved) setConversationId(saved);
    } catch {
      // ignore
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user?.uid || !conversationId) return undefined;
    const ac = new AbortController();
    (async () => {
      try {
        const q = new URLSearchParams({ userId: user.uid, conversationId });
        const r = await fetch(`/api/ai/session?${q}`, { signal: ac.signal });
        if (!r.ok) return;
        const j = await r.json();
        if (j?.reflect) setLastReflect(j.reflect);
        else setLastReflect(null);
      } catch {
        if (ac.signal.aborted) return;
      }
    })();
    return () => ac.abort();
  }, [user?.uid, conversationId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchAIResponse = async (text) => {
    const resp = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        userId: user.uid,
        ...(conversationId ? { conversationId } : {})
      })
    });

    if (!resp.ok) {
      const payload = await resp.json().catch(() => ({}));
      const msg = payload?.error ? String(payload.error) : `HTTP ${resp.status}`;
      throw new Error(msg);
    }

    const data = await resp.json();
    const replyText = typeof data?.text === 'string' ? data.text : '';
    if (data?.conversationId && user?.uid) {
      setConversationId(data.conversationId);
      try {
        sessionStorage.setItem(`ai_chat_cid_${user.uid}`, data.conversationId);
      } catch {
        // ignore
      }
    }
    if (data?.reflect) {
      setLastReflect(data.reflect);
    }
    return { replyText, reflectOk: data?.reflectOk === true };
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    if (sending) return;

    const now = new Date();
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: text,
        createdAt: now,
        status: 'sent'
      }
    ]);
    setInput('');

    setSending(true);

    try {
      const { replyText, reflectOk } = await fetchAIResponse(text);
      setMessages((prev) => {
        const updated = [...prev];
        for (let i = updated.length - 1; i >= 0; i -= 1) {
          if (updated[i].role === 'user') {
            updated[i] = { ...updated[i], status: 'read' };
            break;
          }
        }

        return [
          ...updated,
          {
            role: 'assistant',
            content: (replyText || '（未返回内容）') + (!reflectOk ? `\n\n（${TEXT.reflectFailed}）` : ''),
            createdAt: new Date()
          }
        ];
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `调用 DeepSeek 失败：${msg}`,
          createdAt: new Date()
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  const startNewConversation = () => {
    const nid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setConversationId(nid);
    if (user?.uid) {
      try {
        sessionStorage.setItem(`ai_chat_cid_${user.uid}`, nid);
      } catch {
        // ignore
      }
    }
    setMessages([{ role: 'assistant', content: TEXT.hello, createdAt: new Date() }]);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-2xl">{TEXT.loading}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <nav className="app-top-nav bg-white shadow-md">
        <div className="max-w-full px-[80px] py-4 flex justify-between items-center">
          <div className="flex items-center shrink-0 min-w-0">
            <img
              src="/logo.jpg"
              alt="logo"
              className="w-auto max-h-[2.5rem] shrink-0 object-contain object-left"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xl text-gray-700">{TEXT.welcome}, {user.email}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200/60 overflow-hidden">
            <div className="px-8 py-6 border-b border-white/70 bg-white/80 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">{TEXT.chatTitle}</h2>
              <button
                type="button"
                onClick={startNewConversation}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 bg-white/80"
              >
                {TEXT.newChat}
              </button>
            </div>

            {(lastReflect?.basicInfoLines?.length > 0 ||
              (lastReflect?.lastEmotionalNote && String(lastReflect.lastEmotionalNote).trim())) && (
              <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/90">
                <button
                  type="button"
                  onClick={() => setReflectOpen((o) => !o)}
                  className="w-full flex justify-between items-center text-left gap-2"
                >
                  <span className="text-sm font-semibold text-slate-700">{TEXT.reflectTitle}</span>
                  <span className="text-xs text-slate-500 shrink-0">{reflectOpen ? '收起' : '展开'}</span>
                </button>
                {reflectOpen && (
                  <div className="mt-3 space-y-3 text-[13px] text-slate-600 leading-relaxed">
                    <p className="text-xs text-slate-500">{TEXT.reflectDisclaimer}</p>
                    {lastReflect.basicInfoLines?.length > 0 && (
                      <div>
                        <div className="font-medium text-slate-700 mb-1">{TEXT.reflectPoints}</div>
                        <ul className="list-disc pl-5 space-y-0.5">
                          {lastReflect.basicInfoLines.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {lastReflect.lastEmotionalNote && String(lastReflect.lastEmotionalNote).trim() ? (
                      <div>
                        <div className="font-medium text-slate-700 mb-1">{TEXT.reflectSignals}</div>
                        <p className="whitespace-pre-wrap pl-0.5">
                          {String(lastReflect.lastEmotionalNote).trim()}
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            <div
              ref={listRef}
              className="h-[58vh] min-h-[420px] overflow-y-auto px-12 py-10 space-y-3 bg-[#fafbfc]"
            >
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                const timeLabel = formatTime(message.createdAt);
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}
                  >
                    <div
                      className={`flex items-end gap-5 w-full ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isUser && (
                        <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-base font-bold shrink-0">
                          🤖
                        </div>
                      )}

                      <div
                        className={`max-w-[68%] px-7 py-4 rounded-3xl shadow-sm ${
                          isUser
                            ? 'bg-[#4285f4] text-white text-left'
                            : 'bg-[#f0f2f5] text-gray-800 text-left'
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>

                      {isUser && (
                        <div className="h-16 w-16 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-base font-bold shrink-0">
                          😊
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-2 text-[12px] text-gray-400 px-[54px] ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {timeLabel && <span>{timeLabel}</span>}
                      {isUser && (
                        <span>
                          {message.status === 'read'
                            ? '已读'
                            : message.status === 'sent'
                              ? '已发送'
                              : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/70 px-[10px] py-6 bg-white/90">
              <div className="flex items-center gap-3 rounded-full border border-[#e0e0e0] bg-white px-4 h-12 shadow-sm focus-within:border-[#4285f4] focus-within:shadow-[0_0_0_1px_rgba(66,133,244,0.12)]">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={TEXT.placeholder}
                  className="flex-1 border-0 bg-transparent px-1 text-[15px] focus:outline-none focus:ring-0 placeholder-[#9e9e9e]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4285f4] text-white hover:scale-105 disabled:bg-gray-300 disabled:opacity-70 disabled:cursor-not-allowed transition-transform"
                >
                  <span className="text-sm">{sending ? '…' : '✈️'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AiChat;







