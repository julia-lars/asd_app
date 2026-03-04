import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';

const AiChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // 初始化欢迎消息
    setMessages([
      {
        role: 'assistant',
        content: '你好！我是你的孤独症支持助手。有什么我可以帮助你的吗？'
      }
    ]);
  }, [user, navigate]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 添加用户消息
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // 模拟AI回复（实际项目中这里会调用AI API）
    setTimeout(() => {
      const aiResponse = getAIResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    }, 1000);
  };

  // 模拟AI回复函数
  const getAIResponse = (userInput) => {
    const responses = [
      "我理解你的感受，孤独症患者及其家属确实面临很多挑战。你最近有什么具体的问题或困扰吗？",
      "谢谢你的分享。每个孤独症患者都是独特的，他们的需求和表现也各不相同。你可以告诉我更多关于你遇到的情况吗？",
      "我能感受到你的担忧。记住，你不是一个人在面对这些困难。有很多资源和支持可以帮助你。",
      "你的观察很重要。孤独症患者的行为往往有其背后的原因，理解这些原因可以帮助我们更好地支持他们。",
      "我很欣赏你对家人的关心和付出。照顾孤独症患者确实需要很大的耐心和爱心。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

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
            
            {/* 对话历史 */}
            <div className="border rounded-lg p-4 mb-6 h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <p className="text-xl">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 输入区域 */}
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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
