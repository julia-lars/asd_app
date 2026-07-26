import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n';
import TierComparison from './TierComparison';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const UpgradePanel = ({ open, onClose }) => {
  const { t } = useLanguage();
  const [successTier, setSuccessTier] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // 重置状态
      setSuccessTier(null);
      setError('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const handleUpgrade = async (tier) => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const locale = localStorage.getItem('asd_app_locale') || 'zh-CN';
      const resp = await fetch(`${API_BASE}/api/user/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': locale,
        },
        body: JSON.stringify({ tier }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || '升级失败');
      setSuccessTier(data.tier);
      // 刷新页面使 AuthContext 重新获取用户信息
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  if (successTier) {
    return (
      <div
        className="upgrade-panel-overlay"
        style={{
          position: 'fixed', inset: 0, zIndex: 2147483646,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        }}
      >
        <div
          className="upgrade-panel-sheet"
          style={{
            width: 'min(480px, 100vw)',
            borderRadius: '24px 24px 0 0',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))',
            boxShadow: '0 -8px 40px rgba(28,44,62,0.18)',
            padding: '2rem 1.5rem calc(2rem + env(safe-area-inset-bottom))',
            textAlign: 'center',
            animation: 'slideUp 300ms ease-out',
          }}
        >
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 6px 20px rgba(34,197,94,0.3)',
          }}>
            <span style={{ fontSize: '1.5rem', color: '#fff' }}>✓</span>
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--spa-text)', marginBottom: '0.3rem' }}>
            {t('upgrade.successTitle')}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--spa-muted)', lineHeight: 1.5 }}>
            {t('upgrade.successDesc', { tier: t(`upgrade.tier.${successTier}`) })}
          </p>
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      className="upgrade-panel-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483646,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="upgrade-panel-sheet"
        style={{
          width: 'min(480px, 100vw)',
          maxHeight: '90dvh',
          overflow: 'auto',
          borderRadius: '24px 24px 0 0',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))',
          boxShadow: '0 -8px 40px rgba(28,44,62,0.18)',
          padding: '1.5rem 1.2rem calc(1.5rem + env(safe-area-inset-bottom))',
          animation: 'slideUp 300ms ease-out',
        }}
      >
        {/* 拖拽指示条 */}
        <div
          style={{
            width: '36px',
            height: '4px',
            borderRadius: '2px',
            background: 'var(--spa-line)',
            margin: '0 auto 1rem',
          }}
        />

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            color: 'var(--spa-muted)',
          }}
          aria-label={t('common.close')}
        >
          ✕
        </button>

        {/* 标题 */}
        <h2
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--spa-text)',
            textAlign: 'center',
            marginBottom: '0.15rem',
          }}
        >
          {t('upgrade.title')}
        </h2>

        {/* 错误提示 */}
        {error && (
          <div
            style={{
              background: 'rgba(220,38,38,0.08)',
              color: '#dc2626',
              borderRadius: '10px',
              padding: '0.5rem 1rem',
              fontSize: '0.78rem',
              marginBottom: '0.6rem',
              marginTop: '0.5rem',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* 套餐选择 + 权益对比 */}
        <TierComparison onUpgrade={handleUpgrade} />

        {/* 底部信任文案 */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.68rem',
            color: 'var(--spa-muted)',
            marginTop: '0.6rem',
            lineHeight: 1.5,
          }}
        >
          {t('upgrade.trustNote')}
        </p>
      </div>

      {/* CSS 动画 */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default UpgradePanel;
