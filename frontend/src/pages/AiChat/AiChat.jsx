import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/common/BottomNav';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const TEXT = {
  loading: '加载中...',
  welcome: '欢迎',
  chatTitle: 'AI 助手',
  placeholder: '输入你的问题...',
  send: '发送',
  assistant: 'AI',
  user: '我',
  hello: '你好，我是你的 AI 助手。有什么我可以帮助你的吗？',
  newChat: '新对话',
  reflectTitle: '长期记忆（跨对话，非诊断）',
  reflectDisclaimer:
    '以下由 AI 根据历史对话归纳，仅记录您自述的基本信息与最后一轮情绪感知，未验证、不构成诊断。',
  reflectPoints: '已知背景要点',
  reflectSignals: '最后一轮情绪与支持需求（非诊断）',
  reflectFailed: '本轮归纳未完成，下轮关心语境可能缺失。'
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
        const r = await fetch(`${API_BASE}/api/ai/session?${q}`, { signal: ac.signal });
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
    const resp = await fetch(`${API_BASE}/api/ai/chat`, {
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
    return (
      <div className="flex items-center justify-center h-screen text-xl" style={{ color: 'var(--spa-muted)' }}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--spa-accent)', borderTopColor: 'transparent' }}
          />
          {TEXT.loading}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pb-24">
      <nav className="top-nav-glass">
        <div className="max-w-full px-[80px] py-4 flex justify-between items-center">
          <div className="flex items-center shrink-0 min-w-0">
            <img
              src="/logo.jpg"
              alt="logo"
              className="w-auto max-h-[2.5rem] shrink-0 object-contain object-left rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xl" style={{ color: 'var(--spa-muted)' }}>
              {TEXT.welcome}, {user.email}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card overflow-hidden anim-scale-in">
            <div className="px-8 py-5 flex items-center"
              style={{ borderBottom: '1px solid var(--spa-line)', background: 'rgba(255,255,255,0.5)' }}
            >
              <div className="flex-1" />
              <h2 style={{ fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}
                className="text-2xl font-semibold text-center flex-shrink-0"
              >
                {TEXT.chatTitle}
              </h2>
              <div className="flex-1 flex justify-end">
                <button
                  type="button"
                  onClick={startNewConversation}
                  className="btn-ghost text-sm"
                >
                  {TEXT.newChat}
                </button>
              </div>
            </div>

            {(lastReflect?.basicInfoLines?.length > 0 ||
              (lastReflect?.lastEmotionalNote && String(lastReflect.lastEmotionalNote).trim())) && (
              <div className="px-8 py-4 anim-slide-up"
                style={{
                  borderBottom: '1px solid var(--spa-line)',
                  background: 'rgba(232, 240, 250, 0.5)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setReflectOpen((o) => !o)}
                  className="w-full flex justify-between items-center text-left gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧠</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--spa-text)' }}>
                      {TEXT.reflectTitle}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.6)', color: 'var(--spa-muted)' }}
                  >
                    {reflectOpen ? '收起' : '展开'}
                  </span>
                </button>
                {reflectOpen && (
                  <div className="mt-3 space-y-3 text-[13px] leading-relaxed anim-slide-up"
                    style={{ color: 'var(--spa-muted)' }}
                  >
                    <p className="text-xs px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.5)', color: 'var(--spa-muted)' }}
                    >
                      {TEXT.reflectDisclaimer}
                    </p>
                    {lastReflect.basicInfoLines?.length > 0 && (
                      <div>
                        <div className="font-semibold mb-1.5 flex items-center gap-1.5"
                          style={{ color: 'var(--spa-text)' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--spa-sage)' }} />
                          {TEXT.reflectPoints}
                        </div>
                        <ul className="space-y-1 pl-4">
                          {lastReflect.basicInfoLines.map((b, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span style={{ color: 'var(--spa-accent)' }}>•</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {lastReflect.lastEmotionalNote && String(lastReflect.lastEmotionalNote).trim() ? (
                      <div>
                        <div className="font-semibold mb-1.5 flex items-center gap-1.5"
                          style={{ color: 'var(--spa-text)' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--spa-rose)' }} />
                          {TEXT.reflectSignals}
                        </div>
                        <p className="whitespace-pre-wrap pl-4"
                          style={{ background: 'rgba(255,255,255,0.4)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem' }}
                        >
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
              className="overflow-y-auto px-6 py-8 space-y-5"
              style={{
                height: '58vh',
                minHeight: 420,
                background: 'rgba(250, 251, 252, 0.4)'
              }}
            >
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                const timeLabel = formatTime(message.createdAt);
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5 anim-slide-up`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`flex items-end gap-3 w-full ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isUser && (
                        <div className="avatar-circle avatar-ai">
                          🤖
                        </div>
                      )}

                      <div
                        className={`max-w-[72%] ${isUser ? 'msg-bubble-user' : 'msg-bubble-ai'}`}
                      >
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>

                      {isUser && (
                        <div className="avatar-circle avatar-user">
                          😊
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-2 text-[11px] px-12 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                      style={{ color: 'var(--spa-muted)' }}
                    >
                      {timeLabel && <span>{timeLabel}</span>}
                      {isUser && (
                        <span className="opacity-70">
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

            <div className="px-5 py-4"
              style={{ borderTop: '1px solid var(--spa-line)', background: 'rgba(255,255,255,0.6)' }}
            >
              <div className="flex items-center gap-3 rounded-2xl px-4 h-12"
                style={{
                  border: '1.5px solid var(--spa-line)',
                  background: 'rgba(255,255,255,0.85)',
                  boxShadow: '0 2px 12px rgba(28,44,62,0.04)'
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={TEXT.placeholder}
                  className="flex-1 border-0 bg-transparent px-1 text-[15px] focus:outline-none focus:ring-0"
                  style={{ color: 'var(--spa-text)' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="flex items-center justify-center w-9 h-9 rounded-full text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: input.trim() && !sending
                      ? 'linear-gradient(135deg, var(--spa-accent), var(--spa-accent-strong))'
                      : 'rgba(200,200,200,0.5)',
                    boxShadow: input.trim() && !sending ? '0 4px 16px rgba(122,154,184,0.3)' : 'none'
                  }}
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
