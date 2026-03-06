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

  const shellStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2147483647,
    padding: '0.65rem 0.85rem calc(0.9rem + env(safe-area-inset-bottom))',
    pointerEvents: 'none'
  };

  const panelStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    borderRadius: '18px',
    border: '1px solid rgba(66, 92, 123, 0.22)',
    background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.92), rgba(238, 246, 255, 0.9) 55%, rgba(224, 236, 250, 0.92))',
    boxShadow: '0 24px 46px rgba(28, 44, 62, 0.22), 0 2px 8px rgba(255, 255, 255, 0.55) inset',
    backdropFilter: 'blur(18px) saturate(110%)',
    WebkitBackdropFilter: 'blur(18px) saturate(110%)',
    overflow: 'hidden',
    pointerEvents: 'auto'
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '0.32rem',
    padding: '0.38rem'
  };

  return (
    <div style={shellStyle}>
      <div style={panelStyle}>
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.82), transparent)'
          }}
        />
        <div style={rowStyle}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  minHeight: '60px',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid transparent',
                  borderRadius: '13px',
                  background: isActive
                    ? 'linear-gradient(165deg, rgba(186, 209, 233, 0.72), rgba(156, 186, 217, 0.56))'
                    : 'linear-gradient(165deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.15))',
                  boxShadow: isActive
                    ? '0 10px 16px rgba(55, 84, 116, 0.24), 0 1px 0 rgba(255, 255, 255, 0.72) inset'
                    : '0 1px 0 rgba(255, 255, 255, 0.42) inset',
                  color: isActive ? '#2f4f70' : '#5f7490',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 600,
                  letterSpacing: '0.01em',
                  lineHeight: 1.1,
                  transition: 'all 180ms ease'
                }}
              >
                <span style={{ marginBottom: '0.24rem', fontSize: '1.08rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.81rem' }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;