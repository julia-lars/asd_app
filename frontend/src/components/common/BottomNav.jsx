import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: '资讯',
      path: '/social',
      icon: '📰'
    },
    {
      label: 'AI助手',
      path: '/ai-chat',
      icon: '🤖'
    },
    {
      label: '帮助',
      path: '/help',
      icon: '❓'
    },
    {
      label: '个人',
      path: '/profile',
      icon: '👤'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-20 w-full px-[80px]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 py-2 ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-lg">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
