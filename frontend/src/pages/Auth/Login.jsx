import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
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

  return (
    <div className="auth-bg-overlay">
      <div className="glass-card-strong p-8 w-96 anim-scale-in" style={{ maxWidth: 'min(24rem, calc(100vw - 2rem))' }}>
        <div className="mb-5">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌈</div>
          <h2 className="text-2xl font-bold mb-2 text-center" style={{ fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}>
            {t('auth.login.title')}
          </h2>
          <p className="text-sm" style={{ color: 'var(--spa-muted)' }}>{t('auth.login.subtitle')}</p>
        </div>

        {error && (
          <div className="mb-5 text-center text-sm py-2.5 px-4 rounded-xl"
            style={{ background: 'var(--spa-danger-soft)', color: 'var(--spa-danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--spa-muted)' }}>
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="spa-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--spa-muted)' }}>
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="spa-input"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full mt-2"
          >
            {t('auth.login.submit')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm" style={{ color: 'var(--spa-muted)' }}>
          <p>
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" className="font-semibold" style={{ color: 'var(--spa-accent-strong)' }}>
              {t('auth.register.submit')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
