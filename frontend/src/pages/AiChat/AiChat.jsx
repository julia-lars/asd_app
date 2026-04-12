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
  hello: '\u4f60\u597d\uff0c\u6211\u662f\u4f60\u7684 AI \u52a9\u624b\u3002\u6709\u4ec0\u4e48\u6211\u53ef\u4ee5\u5e2e\u52a9\u4f60\u7684\u5417\uff1f'
};

const AiChat = () => {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
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

    const now = new Date();
    setMessages([
      {
        role: 'assistant',
        content: TEXT.hello,
        createdAt: now
      }
    ]);
  }, [loading, user, navigate]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchAIResponse = async (text) => {
    const resp = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    if (!resp.ok) {
      const payload = await resp.json().catch(() => ({}));
      const msg = payload?.error ? String(payload.error) : `HTTP ${resp.status}`;
      throw new Error(msg);
    }

    const data = await resp.json();
    return typeof data?.text === 'string' ? data.text : '';
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
            content: replyText || '（未返回内容）',
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
            <div className="px-8 py-6 border-b border-white/70 bg-white/80">
              <h2 className="text-2xl font-semibold mb-[10px]">{TEXT.chatTitle}</h2>
            </div>

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







