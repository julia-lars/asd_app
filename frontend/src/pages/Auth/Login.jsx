import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { locale, t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, { locale, fallbackError: t('auth.error.loginFailed') });
      navigate('/ai-chat');
    } catch (err) {
      setError(err.message);
    }
  };

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

  return (
    <div className="auth-bg-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <div className="glass-card-strong anim-scale-in" style={{ padding: '2.5rem 2rem', maxWidth: 'min(22rem, calc(100vw - 2rem))', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.jpg" alt="logo" style={{ width: 128, height: 128, margin: '0 auto 0.8rem', objectFit: 'contain' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--spa-text)', marginBottom: '0.2rem', fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}>
            {t('auth.login.title')}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--spa-muted)' }}>{t('auth.login.subtitle')}</p>
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '0.82rem', padding: '0.6rem 1rem', borderRadius: '10px', background: 'var(--spa-danger-soft)', color: 'var(--spa-danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
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
              style={inputStyle} required />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.3rem', width: '100%', padding: '0.7rem', fontSize: '0.9rem' }}>
            {t('auth.login.submit')}
          </button>
        </form>

        <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--spa-muted)' }}>
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--spa-accent-strong)', textDecoration: 'none' }}>
            {t('auth.register.submit')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
