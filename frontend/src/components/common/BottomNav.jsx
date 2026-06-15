import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n';

const CommunityIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4.25 7.75c0-2.18 1.92-3.95 4.3-3.95h4.15c2.38 0 4.3 1.77 4.3 3.95v1.7c0 2.18-1.92 3.95-4.3 3.95H9.1l-3.08 2.08c-.45.3-1.06-.04-1.02-.58l.22-2.67c-.62-.7-.97-1.66-.97-2.78v-1.7Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinejoin="round"
    />
    <path
      d="M8.15 14.05c.42 1.44 1.9 2.48 3.64 2.48h3.05l2.7 1.82c.42.28.99-.03.95-.53l-.18-2.24c.52-.6.82-1.41.82-2.37v-1.42c0-1.73-1.3-3.17-3.05-3.53"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8.6" cy="8.75" r="0.75" fill="currentColor" />
    <circle cx="12.25" cy="8.75" r="0.75" fill="currentColor" />
  </svg>
);

const AssistantIcon = () => (
  <svg
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
      d="M12 6.1V3.85"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
    />
    <path
      d="M9.1 13.35c1.52 1.02 4.28 1.02 5.8 0"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
    />
    <circle cx="9.15" cy="10.2" r="0.78" fill="currentColor" />
    <circle cx="14.85" cy="10.2" r="0.78" fill="currentColor" />
  </svg>
);

const HelpIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6.4 4.45h8.9c2.02 0 3.65 1.56 3.65 3.5v5.22c0 1.94-1.63 3.5-3.65 3.5h-2.88l-3.02 2.04c-.44.3-1.04-.03-1-.56l.13-1.48H6.4c-2.02 0-3.65-1.56-3.65-3.5V7.95c0-1.94 1.63-3.5 3.65-3.5Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinejoin="round"
    />
    <path
      d="M10.02 9.05c.18-1.04 1.02-1.75 2.1-1.75 1.2 0 2.06.75 2.06 1.78 0 .76-.38 1.25-1.1 1.73-.68.46-1.02.86-1.02 1.55v.24"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12.05" cy="15.03" r="0.72" fill="currentColor" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6.4 4.15h11.2c1.52 0 2.75 1.18 2.75 2.63v10.44c0 1.45-1.23 2.63-2.75 2.63H6.4c-1.52 0-2.75-1.18-2.75-2.63V6.78c0-1.45 1.23-2.63 2.75-2.63Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="10"
      r="2.25"
      stroke="currentColor"
      strokeWidth="1.65"
    />
    <path
      d="M7.95 16.65c.82-1.65 2.27-2.54 4.05-2.54s3.23.89 4.05 2.54"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
    />
  </svg>
);

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    {
      label: t('nav.social'),
      path: '/social',
      icon: <CommunityIcon />
    },
    {
      label: t('nav.aiChat'),
      path: '/ai-chat',
      icon: <AssistantIcon />
    },
    {
      label: t('nav.help'),
      path: '/help',
      icon: <HelpIcon />
    },
    {
      label: t('nav.profile'),
      path: '/profile',
      icon: <ProfileIcon />
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
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.24rem',
                    fontSize: '1.15rem'
                  }}
                >
                  {item.icon}
                </span>
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
