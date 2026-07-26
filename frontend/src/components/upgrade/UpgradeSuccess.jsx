import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const UpgradeSuccess = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [tier, setTier] = useState(searchParams.get('tier') || 'mid');

  useEffect(() => {
    // 刷新用户信息以获取最新 tier
    const refreshUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const locale = localStorage.getItem('asd_app_locale') || 'zh-CN';
        const resp = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}`, 'Accept-Language': locale },
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.user?.tier) {
            setTier(data.user.tier);
          }
        }
      } catch {
        // 静默失败，使用 URL 参数中的 tier
      } finally {
        setChecking(false);
      }
    };
    refreshUser();
  }, []);

  if (checking) {
    return (
      <div className="flex h-[100dvh] items-center justify-center" style={{ background: 'var(--spa-bg)' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--spa-accent)', borderTopColor: 'transparent' }}
          />
          <span style={{ color: 'var(--spa-muted)' }}>{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  const tierLabel = t(`upgrade.tier.${tier}`);

  return (
    <div
      className="flex h-[100dvh] items-center justify-center px-4"
      style={{ background: 'var(--spa-bg)' }}
    >
      <div
        className="glass-card-strong"
        style={{
          maxWidth: '380px',
          width: '100%',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
        }}
      >
        {/* 成功图标 */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
          }}
        >
          <span style={{ fontSize: '2rem', color: '#fff' }}>✓</span>
        </div>

        {/* 标题 */}
        <h2
          style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'var(--spa-text)',
            marginBottom: '0.4rem',
          }}
        >
          {t('upgrade.successTitle')}
        </h2>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--spa-muted)',
            marginBottom: '1.5rem',
            lineHeight: 1.6,
          }}
        >
          {t('upgrade.successDesc', { tier: tierLabel })}
        </p>

        {/* 引导操作 */}
        {tier === 'premium' && (
          <div
            className="glass-card"
            style={{
              borderRadius: '14px',
              padding: '0.9rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
              fontSize: '0.82rem',
              color: 'var(--spa-text)',
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>🎉 {t('upgrade.newFeatures')}</div>
            <div style={{ color: 'var(--spa-muted)', fontSize: '0.75rem' }}>
              {t('upgrade.successPremiumHint')}
            </div>
          </div>
        )}

        {tier === 'mid' && (
          <div
            className="glass-card"
            style={{
              borderRadius: '14px',
              padding: '0.9rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
              fontSize: '0.82rem',
              color: 'var(--spa-text)',
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>🎉 {t('upgrade.newFeatures')}</div>
            <div style={{ color: 'var(--spa-muted)', fontSize: '0.75rem' }}>
              {t('upgrade.successMidHint')}
            </div>
          </div>
        )}

        {/* 按钮 */}
        <button
          onClick={() => navigate('/ai-chat')}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: '14px',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
            marginBottom: '0.75rem',
          }}
        >
          {t('upgrade.startUsing')}
        </button>

        <button
          onClick={() => navigate('/profile')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--spa-muted)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {t('upgrade.backToProfile')}
        </button>
      </div>
    </div>
  );
};

export default UpgradeSuccess;
