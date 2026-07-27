import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LANGUAGE_OPTIONS, DEFAULT_LOCALE } from '../../i18n';

const Welcome = () => {
  const navigate = useNavigate();

  const handleSelect = (code) => {
    localStorage.setItem('asd_app_locale', code);
    navigate('/login');
  };

  return (
    <div className="auth-bg-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <div className="glass-card-strong anim-scale-in" style={{ padding: '2.5rem 2rem', maxWidth: 'min(22rem, calc(100vw - 2rem))', width: '100%', textAlign: 'center' }}>
        <img src="/logo.jpg" alt="logo" style={{ width: 160, height: 160, margin: '0 auto 1.2rem', objectFit: 'contain' }} />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--spa-text)', marginBottom: '0.3rem', fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}>
          SpectraLink
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--spa-muted)', marginBottom: '2rem' }}>
          选择您的语言 / Choose your language
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem',
                width: '100%', padding: '0.8rem 1.1rem',
                borderRadius: '12px',
                border: '1px solid var(--spa-line)',
                background: lang.code === DEFAULT_LOCALE ? 'rgba(37,99,235,0.06)' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 160ms ease',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37,99,235,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = lang.code === DEFAULT_LOCALE ? 'rgba(37,99,235,0.06)' : 'rgba(255,255,255,0.5)'; }}
            >
              <span style={{ fontSize: '1.2rem' }}>{lang.label.split(' ')[0]}</span>
              <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600, color: 'var(--spa-text)' }}>
                {lang.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--spa-muted)' }}>
                {lang.shortLabel}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
