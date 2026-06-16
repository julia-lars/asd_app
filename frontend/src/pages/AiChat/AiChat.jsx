import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/common/BottomNav';
import { useLanguage } from '../../i18n';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const stripAssistantBoldMarkers = (value) => String(value ?? '').replace(/\*\*/g, '');

const STARTER_DIALOGUES = [
  {
    role: 'user',
    content: "My child is terrified of the dentist. Last time, he wouldn't follow any instructions from me or the dentist, and we failed. Any practical tips for next time?",
    status: 'read'
  },
  {
    role: 'assistant',
    content: `Try making the next visit a “practice visit,” not a full treatment visit.
1. Call ahead: ask for a quiet time slot and tell the dentist his triggers.
2. Bring a 3-step picture plan: enter → sit → count teeth.
3. Practice the same steps at home for 2–3 minutes, then reward.
4. Use one instruction at a time and agree on a stop signal.
5. Celebrate any small success; stop before panic escalates.

Based on AAPD “Behavior Guidance for the Pediatric Dental Patient” and “Sensory Adapted Dental Environments to Enhance Oral Care for Children with Autism Spectrum Disorders.”`
  },
  {
    role: 'user',
    content: 'I spend pretty much all day, every day just focused on my child. I’m burned out and nothing feels worth it anymore. Any advice?',
    status: 'read'
  },
  {
    role: 'assistant',
    content: `I’m sorry it feels this heavy. If you might hurt yourself or your child, call local emergency services or a crisis line now.

A short care plan:
1. Pick one priority today: food, sleep, safety, or school.
2. Use a visual routine with only 3–4 steps.
3. Ask for one concrete break: “Can you cover 20 minutes?”
4. Tell your child’s clinician you are burned out and need support.

Based on NICE “Autism spectrum disorder in under 19s: support and management.”`
  }
];

const createStarterMessages = () => {
  const createdAt = new Date();
  return STARTER_DIALOGUES.map((message) => ({ ...message, fixed: true, createdAt }));
};

const RiskNoteIcon = () => (
  <svg
    className="ai-risk-note-icon"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 3.85 18.4 6.2v5.12c0 3.86-2.5 6.88-6.4 8.83-3.9-1.95-6.4-4.97-6.4-8.83V6.2L12 3.85Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinejoin="round"
    />
    <path
      d="M12 8.45v6.05M8.98 11.48h6.04"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
    />
  </svg>
);

const AiAvatarIcon = () => (
  <svg
    className="chat-avatar-icon"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M7.2 6.1h9.6c1.7 0 3.05 1.32 3.05 2.94v4.62c0 1.62-1.35 2.94-3.05 2.94H7.2c-1.7 0-3.05-1.32-3.05-2.94V9.04C4.15 7.42 5.5 6.1 7.2 6.1Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinejoin="round"
    />
    <path
      d="M12 6.1V3.85M9.1 13.35c1.52 1.02 4.28 1.02 5.8 0"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
    />
    <circle cx="9.15" cy="10.2" r="0.78" fill="currentColor" />
    <circle cx="14.85" cy="10.2" r="0.78" fill="currentColor" />
  </svg>
);

const UserAvatarIcon = () => (
  <svg
    className="chat-avatar-icon"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="12"
      cy="9.2"
      r="3"
      stroke="currentColor"
      strokeWidth="1.65"
    />
    <path
      d="M6.8 18.4c1.02-2.4 2.86-3.72 5.2-3.72s4.18 1.32 5.2 3.72"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
    />
  </svg>
);

const SendIcon = () => (
  <svg
    className="send-icon"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4.55 11.82 19.4 4.86c.5-.23 1.02.26.82.78l-5.46 14.22c-.2.53-.93.56-1.17.05l-2.24-4.7-4.87-2.18c-.52-.24-.55-.97-.03-1.21Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinejoin="round"
    />
    <path
      d="m11.35 15.2 3.02-3.08"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
    />
  </svg>
);

const AiChat = () => {
  const { user, loading } = useAuth();
  const { locale, t, formatTime } = useLanguage();
  const [messages, setMessages] = useState(createStarterMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const navigate = useNavigate();
  const listRef = useRef(null);

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
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchAIResponse = async (text) => {
    const resp = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept-Language': locale },
      body: JSON.stringify({
        message: text,
        userId: user.uid,
        locale,
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
    return replyText;
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
      const replyText = await fetchAIResponse(text);
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
            content: stripAssistantBoldMarkers(replyText || t('ai.noReply')),
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
          content: stripAssistantBoldMarkers(t('ai.callFailed', { message: msg })),
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
    setMessages(createStarterMessages());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl" style={{ color: 'var(--spa-muted)' }}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--spa-accent)', borderTopColor: 'transparent' }}
          />
          {t('common.loading')}
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
              {t('common.welcomeUser', { email: user.email })}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-4xl mx-auto">
          <div className="ai-risk-note anim-slide-up">
            <RiskNoteIcon />
            <span>{t('ai.riskNote')}</span>
          </div>

          <div className="glass-card overflow-hidden anim-scale-in">
            <div className="px-8 py-5 flex items-center"
              style={{ borderBottom: '1px solid var(--spa-line)', background: 'rgba(255,255,255,0.5)' }}
            >
              <div className="flex-1" />
              <h2 style={{ fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}
                className="text-2xl font-semibold text-center flex-shrink-0"
              >
                {t('ai.chatTitle')}
              </h2>
              <div className="flex-1 flex justify-end">
                <button
                  type="button"
                  onClick={startNewConversation}
                  className="btn-ghost text-sm"
                  style={{ padding: '0.35rem 0.72rem', fontSize: '0.78rem', borderRadius: '999px' }}
                >
                  New
                </button>
              </div>
            </div>

            <div
              ref={listRef}
              className="overflow-y-auto px-6 py-8 space-y-5"
              style={{
                height: 'clamp(500px, 68vh, 680px)',
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
                          <AiAvatarIcon />
                        </div>
                      )}

                      <div
                        className={`max-w-[72%] ${isUser ? 'msg-bubble-user' : 'msg-bubble-ai'}`}
                      >
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                          {message.kind === 'intro'
                            ? t('ai.hello')
                            : isUser
                              ? message.content
                              : stripAssistantBoldMarkers(message.content)}
                        </p>
                      </div>

                      {isUser && (
                        <div className="avatar-circle avatar-user">
                          <UserAvatarIcon />
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
                            ? t('ai.read')
                            : message.status === 'sent'
                              ? t('ai.sent')
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
                  placeholder={t('ai.placeholder')}
                  className="flex-1 border-0 bg-transparent px-1 text-[15px] focus:outline-none focus:ring-0"
                  style={{ color: 'var(--spa-text)' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  aria-label={t('ai.send')}
                  className="flex items-center justify-center w-9 h-9 rounded-full text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: input.trim() && !sending
                      ? 'linear-gradient(135deg, var(--spa-accent), var(--spa-accent-strong))'
                      : 'rgba(200,200,200,0.5)',
                    boxShadow: input.trim() && !sending ? '0 4px 16px rgba(122,154,184,0.3)' : 'none'
                  }}
                >
                  {sending ? <span className="send-loading" aria-hidden="true">…</span> : <SendIcon />}
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
