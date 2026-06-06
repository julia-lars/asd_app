import React, { createContext, useContext, useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const LOCALE_STORAGE_KEY = 'asd_app_locale';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const locale = localStorage.getItem(LOCALE_STORAGE_KEY) || 'zh-CN';
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, 'Accept-Language': locale },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, options = {}) => {
    const locale = options.locale || localStorage.getItem(LOCALE_STORAGE_KEY) || 'zh-CN';
    const resp = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept-Language': locale },
      body: JSON.stringify({ email, password }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || options.fallbackError || '登录失败');
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (email, password, name, options = {}) => {
    const locale = options.locale || localStorage.getItem(LOCALE_STORAGE_KEY) || 'zh-CN';
    const resp = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept-Language': locale },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || options.fallbackError || '注册失败');
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = { user, loading, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
