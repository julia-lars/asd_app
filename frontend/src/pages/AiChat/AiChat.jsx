import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/common/BottomNav';

const TEXT = {
  loading: '\u52a0\u8f7d\u4e2d...',
  appTitle: '\u5b64\u72ec\u75c7\u652f\u6301\u5e73\u53f0',
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
  const navigate = useNavigate();
  const listRef = useRef(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    setMessages([
      {
        role: 'assistant',
        content: TEXT.hello
      }
    ]);
  }, [loading, user, navigate]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const getAIResponse = () => {
    const responses = [
      '\u6211\u7406\u89e3\u4f60\u7684\u611f\u53d7\u3002\u53ef\u4ee5\u5148\u544a\u8bc9\u6211\u4f60\u73b0\u5728\u6700\u56f0\u6270\u7684\u5177\u4f53\u95ee\u9898\u5417\uff1f',
      '\u8c22\u8c22\u4f60\u7684\u5206\u4eab\u3002\u6bcf\u4f4d\u7528\u6237\u7684\u60c5\u51b5\u90fd\u4e0d\u540c\uff0c\u6211\u4eec\u53ef\u4ee5\u4e00\u6b65\u4e00\u6b65\u6765\u3002',
      '\u4f60\u5e76\u4e0d\u5b64\u5355\u3002\u6211\u4eec\u53ef\u4ee5\u5148\u4ece\u4e00\u4e2a\u5c0f\u76ee\u6807\u5f00\u59cb\u3002',
      '\u4f60\u7684\u89c2\u5bdf\u5f88\u91cd\u8981\uff0c\u8fd9\u6709\u52a9\u4e8e\u6211\u4eec\u627e\u5230\u66f4\u5408\u9002\u7684\u652f\u6301\u65b9\u5f0f\u3002',
      '\u4f60\u5df2\u7ecf\u505a\u5f97\u5f88\u597d\u4e86\uff0c\u6211\u4eec\u7ee7\u7eed\u4e00\u8d77\u6574\u7406\u4e0b\u4e00\u6b65\u3002'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const text = input;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: getAIResponse() }]);
    }, 600);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-2xl">{TEXT.loading}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <nav className="bg-white shadow-md">
        <div className="max-w-full px-[80px] py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">{TEXT.appTitle}</h1>
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
              className="h-[58vh] min-h-[420px] overflow-y-auto px-8 py-8 space-y-6"
            >
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <div key={index} className={`flex items-start gap-4 px-[10px] ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && (
                      <div className="h-20 w-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                        {TEXT.assistant}
                      </div>
                    )}

                    <div
                      className={`max-w-[78%] rounded-full px-6 py-5 shadow-sm border ${
                        isUser
                          ? 'bg-blue-100 border-blue-100/70 text-gray-800'
                          : 'bg-gray-50 border-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-lg leading-8">{message.content}</p>
                    </div>

                    {isUser && (
                      <div className="h-20 w-20 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-bold shrink-0">
                        {TEXT.user}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/70 px-[10px] py-6 bg-white/90">
              <div className="flex items-center gap-3 rounded-full border border-slate-200/65 bg-white px-3 py-3 shadow-sm">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={TEXT.placeholder}
                  className="flex-1 border-0 bg-transparent px-3 py-3 text-lg focus:outline-none focus:ring-0"
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors text-base font-semibold"
                >
                  {TEXT.send}
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







