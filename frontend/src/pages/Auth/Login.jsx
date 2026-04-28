import React, { useState } from 'react';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const TEXT = {
  title: '登录',
  subtitle: '欢迎回来，继续您的温暖之旅',
  email: '邮箱',
  password: '密码',
  noAccount: '还没有账号？',
  register: '注册',
  login: '登录'
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/ai-chat');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-bg-overlay">
      <div className="glass-card-strong p-8 w-96 anim-scale-in" style={{ maxWidth: 'min(24rem, calc(100vw - 2rem))' }}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌈</div>
          <h2 className="text-2xl font-bold mb-2 text-center" style={{ fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}>
            {TEXT.title}
          </h2>
          <p className="text-sm" style={{ color: 'var(--spa-muted)' }}>{TEXT.subtitle}</p>
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
              {TEXT.email}
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
              {TEXT.password}
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
            {TEXT.login}
          </button>
        </form>

        <div className="mt-6 text-center text-sm" style={{ color: 'var(--spa-muted)' }}>
          <p>
            {TEXT.noAccount}{' '}
            <Link to="/register" className="font-semibold" style={{ color: 'var(--spa-accent-strong)' }}>
              {TEXT.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
