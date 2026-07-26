import React, { useState } from 'react';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';

const TIERS = [
  {
    key: 'free',
    price: '¥0',
    period: '',
    cta: null,
    taglineKey: 'upgrade.freeHint',
    features: [
      { key: 'aiAssistant', value: true },
      { key: 'dashboard', value: 'basic' },
      { key: 'community', value: true },
      { key: 'groupCounseling', value: false },
      { key: 'oneOnOneExpert', value: false },
      { key: 'growthReport', value: false },
      { key: 'prioritySupport', value: false },
    ],
  },
  {
    key: 'mid',
    price: '¥19',
    period: '/月',
    cta: 'upgrade',
    taglineKey: 'upgrade.midHint',
    features: [
      { key: 'aiAssistant', value: true },
      { key: 'dashboard', value: 'full' },
      { key: 'community', value: true },
      { key: 'groupCounseling', value: '4次' },
      { key: 'oneOnOneExpert', value: false },
      { key: 'growthReport', value: '每月' },
      { key: 'prioritySupport', value: false },
    ],
  },
  {
    key: 'premium',
    price: '¥39',
    period: '/月',
    cta: 'upgrade',
    taglineKey: 'upgrade.premiumHint',
    recommended: true,
    features: [
      { key: 'aiAssistant', value: true },
      { key: 'dashboard', value: 'full' },
      { key: 'community', value: true },
      { key: 'groupCounseling', value: '8次' },
      { key: 'oneOnOneExpert', value: '2次' },
      { key: 'growthReport', value: '每周' },
      { key: 'prioritySupport', value: true },
    ],
  },
];

const FEATURE_KEYS = [
  'aiAssistant',
  'dashboard',
  'community',
  'groupCounseling',
  'oneOnOneExpert',
  'growthReport',
  'prioritySupport',
];

/* ---- 小工具 ---- */
const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.8" />
    <path d="M7.5 12l3 3 6-6" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cross = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.2" />
    <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const TierComparison = ({ onUpgrade }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const currentTier = user?.tier || 'free';
  const [selected, setSelected] = useState(currentTier);

  const selectedTier = TIERS.find((t) => t.key === selected);

  return (
    <div style={{ padding: '0 0 0.5rem' }}>
      {/* ========== 上段：横向套餐选择卡片 ========== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.6rem',
          marginBottom: '1rem',
        }}
      >
        {TIERS.map((tier) => {
          const isCurrent = tier.key === currentTier;
          const isSelected = tier.key === selected;
          const isRec = tier.recommended;

          return (
            <button
              key={tier.key}
              onClick={() => setSelected(tier.key)}
              style={{
                position: 'relative',
                borderRadius: '14px',
                padding: isRec ? '0.9rem 0.5rem 0.75rem' : '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                border: isSelected
                  ? '2px solid #2563eb'
                  : isRec
                    ? '1.5px solid #93c5fd'
                    : '1px solid var(--spa-line)',
                background: isSelected
                  ? 'linear-gradient(180deg, rgba(37,99,235,0.08), rgba(255,255,255,0.95))'
                  : isRec
                    ? 'linear-gradient(180deg, rgba(59,130,246,0.06), rgba(255,255,255,0.9))'
                    : 'rgba(255,255,255,0.6)',
                boxShadow: isSelected
                  ? '0 4px 16px rgba(37,99,235,0.15)'
                  : '0 1px 6px rgba(28,44,62,0.04)',
                transition: 'all 180ms ease',
                outline: 'none',
              }}
            >
              {/* 推荐标签 */}
              {isRec && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-9px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#fff',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    borderRadius: '10px',
                    padding: '0.15rem 0.7rem',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.02em',
                  }}
                >
                  推荐
                </div>
              )}

              {/* 名称 */}
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: isSelected ? '#1d4ed8' : 'var(--spa-text)',
                  marginBottom: '0.15rem',
                  marginTop: isRec ? '0.2rem' : 0,
                }}
              >
                {t(`upgrade.tier.${tier.key}`)}
              </div>

              {/* 价格 */}
              <div style={{ marginBottom: '0.15rem' }}>
                <span
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: isSelected ? '#1d4ed8' : 'var(--spa-text)',
                    lineHeight: 1.1,
                  }}
                >
                  {tier.price}
                </span>
                {tier.period && (
                  <span style={{ fontSize: '0.68rem', color: 'var(--spa-muted)', marginLeft: '1px' }}>
                    {tier.period}
                  </span>
                )}
              </div>

              {/* 当前方案标记 */}
              {isCurrent ? (
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: '#16a34a',
                    background: 'rgba(22,163,74,0.1)',
                    borderRadius: '6px',
                    padding: '0.1rem 0.45rem',
                    display: 'inline-block',
                  }}
                >
                  {t('upgrade.currentPlan')}
                </div>
              ) : (
                <div style={{ height: '1.2rem' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ========== 选中套餐的升级按钮 ========== */}
      {selectedTier && selectedTier.cta && selected !== currentTier && (
        <button
          onClick={() => onUpgrade && onUpgrade(selectedTier.key)}
          style={{
            width: '100%',
            padding: '0.65rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
            marginBottom: '0.75rem',
            letterSpacing: '0.03em',
          }}
        >
          {t('upgrade.cta')} — {t(`upgrade.tier.${selected}`)} {selectedTier.price}{selectedTier.period}
        </button>
      )}

      {/* ========== 下段：功能对比表 ========== */}
      <div
        style={{
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid var(--spa-line)',
          background: 'rgba(255,255,255,0.75)',
        }}
      >
        {/* 表头 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            gap: '0.3rem',
            padding: '0.6rem 0.75rem',
            background: 'rgba(241,245,249,0.8)',
            borderBottom: '1px solid var(--spa-line)',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--spa-muted)',
            textAlign: 'center',
          }}
        >
          <div style={{ textAlign: 'left' }}>{/* 空 */}</div>
          {TIERS.map((tier) => (
            <div
              key={tier.key}
              style={{
                color: tier.key === selected ? '#1d4ed8' : undefined,
                fontWeight: tier.key === selected ? 800 : 700,
              }}
            >
              {t(`upgrade.tier.${tier.key}`)}
            </div>
          ))}
        </div>

        {/* 表体 */}
        {FEATURE_KEYS.map((fKey, idx) => {
          const isLast = idx === FEATURE_KEYS.length - 1;
          return (
            <div
              key={fKey}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
                gap: '0.3rem',
                padding: '0.55rem 0.75rem',
                borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.04)',
                background: idx % 2 === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(248,250,252,0.4)',
                alignItems: 'center',
              }}
            >
              {/* 功能名称 */}
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--spa-text)',
                  fontWeight: 500,
                  textAlign: 'left',
                }}
              >
                {t(`upgrade.feature.${fKey}`)}
              </div>

              {/* 各层级的取值 */}
              {TIERS.map((tier) => {
                const val = tier.features.find((f) => f.key === fKey)?.value;
                const isSel = tier.key === selected;

                return (
                  <div
                    key={tier.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '24px',
                    }}
                  >
                    {val === true ? (
                      <Check />
                    ) : val === false ? (
                      <Cross />
                    ) : (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: isSel ? 700 : 500,
                          color: isSel ? '#1d4ed8' : 'var(--spa-text)',
                        }}
                      >
                        {val}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TierComparison;
