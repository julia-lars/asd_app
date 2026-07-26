import React from 'react';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { IconCrown, IconDiamond } from '../common/Icons';

const UpgradeBanner = ({ onOpenPanel }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const tier = user?.tier || 'free';

  const isFree = tier === 'free';
  const isMid = tier === 'mid';
  const isPremium = tier === 'premium';

  const bannerStyle = {
    borderRadius: '16px',
    padding: '1rem 1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'transform 150ms ease',
    marginBottom: '1rem',
    ...(isFree
      ? {
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
          boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
        }
      : isMid
        ? {
            background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
            boxShadow: '0 2px 8px rgba(100,116,139,0.15)',
          }
        : {
            background: 'linear-gradient(135deg, #1e3a5f, #1d4ed8, #2563eb)',
            boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
          }),
  };

  const titleColor = isFree ? '#fff' : isMid ? '#334155' : '#fff';
  const subColor = isFree ? 'rgba(255,255,255,0.85)' : isMid ? '#64748b' : 'rgba(255,255,255,0.8)';
  const badgeBg = isFree
    ? 'rgba(255,255,255,0.95)'
    : isMid
      ? 'rgba(255,255,255,0.8)'
      : 'rgba(255,255,255,0.2)';
  const badgeColor = isFree ? '#d97706' : isMid ? '#475569' : '#fff';

  return (
    <div
      onClick={onOpenPanel}
      style={bannerStyle}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.4rem' }}>{isPremium ? <IconDiamond /> : <IconCrown />}</span>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: titleColor }}>
            {isFree && t('upgrade.bannerTitleFree')}
            {isMid && t('upgrade.bannerTitleMid')}
            {isPremium && t('upgrade.bannerTitlePremium')}
          </div>
          <div style={{ fontSize: '0.72rem', color: subColor, marginTop: '0.1rem' }}>
            {isFree && t('upgrade.bannerSubFree')}
            {isMid && t('upgrade.bannerSubMid')}
            {isPremium && t('upgrade.bannerSubPremium')}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '0.4rem 0.9rem',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: 700,
          background: badgeBg,
          color: badgeColor,
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap',
          border: isPremium ? '1px solid rgba(255,255,255,0.3)' : 'none',
        }}
      >
        {isPremium ? 'VIP' : t('upgrade.cta')}
      </div>
    </div>
  );
};

export default UpgradeBanner;
