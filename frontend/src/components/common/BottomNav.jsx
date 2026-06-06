import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    {
      label: t('nav.social'),
      path: '/social',
      icon: '📰'
    },
    {
      label: t('nav.aiChat'),
      path: '/ai-chat',
      icon: '🤖'
    },
    {
      label: t('nav.help'),
      path: '/help',
      icon: '❓'
    },
    {
      label: t('nav.profile'),
      path: '/profile',
      icon: '👤'
    }
  ];

  const shellStyle = {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(420px, 100vw)',
    zIndex: 2147483647,
    padding: '0.65rem 0.85rem calc(0.9rem + env(safe-area-inset-bottom))',
    pointerEvents: 'none'
  };

  const panelStyle = {
    width: '100%',
    borderRadius: '20px',
    border: '1px solid rgba(66, 92, 123, 0.18)',
    background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.94), rgba(240, 248, 255, 0.92) 55%, rgba(230, 242, 255, 0.94))',
    boxShadow: '0 24px 46px rgba(28, 44, 62, 0.18), 0 2px 8px rgba(255, 255, 255, 0.6) inset',
    backdropFilter: 'blur(20px) saturate(130%)',
    WebkitBackdropFilter: 'blur(20px) saturate(130%)',
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
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)'
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
                  borderRadius: '14px',
                  background: isActive
                    ? 'linear-gradient(165deg, rgba(186, 209, 233, 0.65), rgba(156, 186, 217, 0.5))'
                    : 'linear-gradient(165deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2))',
                  boxShadow: isActive
                    ? '0 10px 16px rgba(55, 84, 116, 0.2), 0 1px 0 rgba(255, 255, 255, 0.8) inset'
                    : '0 1px 0 rgba(255, 255, 255, 0.5) inset',
                  color: isActive ? '#2f4f70' : '#6b8299',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.01em',
                  lineHeight: 1.1,
                  transition: 'all 200ms ease',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <span style={{ marginBottom: '0.24rem', fontSize: '1.15rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.78rem' }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
