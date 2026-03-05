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
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 9999,
      borderTop: '1px solid #e5e7eb',
      height: '5rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100%',
        width: '100%'
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: '0.5rem',
                color: isActive ? '#2563eb' : '#6b7280',
                fontWeight: isActive ? '600' : '400',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</span>
              <span style={{ fontSize: '1rem' }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
