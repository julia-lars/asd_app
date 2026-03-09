import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/common/BottomNav';

const AiChat = () => {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    setMessages([
      {
        role: 'assistant',
        content: '你好，我是你的 AI 助手。有什么我可以帮助你的吗？'
      }
    ]);
  }, [loading, user, navigate]);

  const getAIResponse = () => {
    const responses = [
      '我理解你的感受。可以先告诉我你现在最困扰的具体问题吗？',
      '谢谢你的分享。每位用户的情况都不同，我们可以一步一步来。',
      '你并不孤单。我们可以先从一个小目标开始。',
      '你的观察很重要，这有助于我们找到更合适的支持方式。',
      '你已经做得很好了，我们继续一起整理下一步。'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const text = input;
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: getAIResponse() }]);
    }, 600);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-2xl">加载中...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <nav className="bg-white shadow-md">
        <div className="max-w-full px-[80px] py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">孤独症支持平台</h1>
          <div className="flex items-center space-x-4">
            <span className="text-xl text-gray-700">欢迎, {user.email}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">AI 助手</h2>

            <div className="border rounded-lg p-4 mb-6 h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <p className="text-xl">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入你的问题..."
                className="flex-1 border rounded-l-md p-4 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white py-4 px-6 rounded-r-md hover:bg-blue-600 transition-colors text-xl"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AiChat;
