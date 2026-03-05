import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: '\u8d44\u8baf',
      path: '/social',
      icon: '\uD83D\uDCF0'
    },
    {
      label: 'AI\u52a9\u624b',
      path: '/ai-chat',
      icon: '\uD83E\uDD16'
    },
    {
      label: '\u5e2e\u52a9',
      path: '/help',
      icon: '\u2753'
    },
    {
      label: '\u4e2a\u4eba',
      path: '/profile',
      icon: '\uD83D\uDC64'
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2147483647,
        padding: '0.5rem 0.75rem calc(0.75rem + env(safe-area-inset-bottom))',
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.96)',
          border: '1px solid rgba(37, 53, 47, 0.2)',
          boxShadow: '0 14px 30px rgba(20, 29, 25, 0.22)',
          borderRadius: '16px',
          overflow: 'hidden',
          pointerEvents: 'auto'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '0.25rem',
            padding: '0.3rem'
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  minHeight: '58px',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(182, 198, 189, 0.45)' : 'transparent',
                  color: isActive ? '#3c544b' : '#5d6a64',
                  cursor: 'pointer',
                  fontWeight: 600,
                  lineHeight: 1.1
                }}
              >
                <span style={{ marginBottom: '0.2rem', fontSize: '1.05rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.8rem' }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;