import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n';

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  fontSize: '0.9rem',
  border: '1px solid var(--spa-line)',
  borderRadius: '10px',
  background: 'rgba(255,255,255,0.7)',
  color: 'var(--spa-text)',
  outline: 'none',
  transition: 'border-color 160ms ease',
};

const PrivacySheet = ({ open, onClose, t }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: 'min(480px, 100vw)', maxHeight: '70dvh', overflow: 'auto', borderRadius: '20px 20px 0 0', background: '#fff', padding: '1.5rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom))', animation: 'slideUp 250ms ease-out' }}>
        <div style={{ width: 32, height: 3, borderRadius: 2, background: 'var(--spa-line)', margin: '0 auto 0.8rem' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--spa-text)', marginBottom: '1rem' }}>
          {t('auth.privacyTitle')}
        </h3>
        <div style={{ fontSize: '0.82rem', color: 'var(--spa-muted)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '0.8rem' }}>{t('auth.privacyContent1')}</p>
          <p style={{ marginBottom: '0.8rem' }}>{t('auth.privacyContent2')}</p>
          <p style={{ marginBottom: '0.8rem' }}>{t('auth.privacyContent3')}</p>
          <p>{t('auth.privacyContent4')}</p>
        </div>
        <button onClick={onClose} className="btn-primary" style={{ marginTop: '1.2rem', width: '100%', padding: '0.7rem' }}>
          {t('auth.privacyClose')}
        </button>
        <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      </div>
    </div>
  );
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const { register } = useAuth();
  const { locale, t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError(t('auth.privacyRequired')); return; }
    setError('');
    setSubmitting(true);
    try {
      await register(email, password, name, { locale, fallbackError: t('auth.error.registerFailed') });
      navigate('/ai-chat');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-bg-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <div className="glass-card-strong anim-scale-in" style={{ padding: '2.5rem 2rem', maxWidth: 'min(22rem, calc(100vw - 2rem))', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.jpg" alt="logo" style={{ width: 128, height: 128, margin: '0 auto 0.8rem', objectFit: 'contain' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--spa-text)', marginBottom: '0.2rem', fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}>
            {t('auth.register.title')}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--spa-muted)' }}>{t('auth.register.subtitle')}</p>
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '0.82rem', padding: '0.6rem 1rem', borderRadius: '10px', background: 'var(--spa-danger-soft)', color: 'var(--spa-danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--spa-muted)', marginBottom: '0.35rem' }}>
              {t('auth.name')}
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              style={inputStyle} required placeholder={t('auth.name')} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--spa-muted)', marginBottom: '0.35rem' }}>
              {t('auth.email')}
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={inputStyle} required placeholder="email@example.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--spa-muted)', marginBottom: '0.35rem' }}>
              {t('auth.password')}
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={inputStyle} required minLength={6} />
          </div>

          {/* 隐私协议勾选 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--spa-accent)' }} id="privacy-check" />
            <label htmlFor="privacy-check" style={{ fontSize: '0.75rem', color: 'var(--spa-muted)', cursor: 'pointer' }}>
              {t('auth.privacyAgree')}{' '}
              <span onClick={(e) => { e.preventDefault(); setPrivacyOpen(true); }}
                style={{ color: 'var(--spa-accent-strong)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                {t('auth.privacyLink')}
              </span>
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}
            style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                {t('common.loading')}
              </span>
            ) : t('auth.register.submit')}
          </button>
        </form>

        <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--spa-muted)' }}>
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--spa-accent-strong)', textDecoration: 'none' }}>
            {t('auth.login.submit')}
          </Link>
        </div>
      </div>

      <PrivacySheet open={privacyOpen} onClose={() => setPrivacyOpen(false)} t={t} />
    </div>
  );
};

export default Register;
