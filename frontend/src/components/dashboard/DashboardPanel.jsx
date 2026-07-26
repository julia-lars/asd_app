import React, { useState } from 'react';
import { useLanguage } from '../../i18n';
import { IconDashboard, IconLock } from '../../components/common/Icons';
import { useAuth } from '../../contexts/AuthContext';
import DimensionModal from './DimensionModal';

/* ---- 固定数据 ---- */
const DASHBOARD_DATA = {
  child: {
    key: 'child',
    labelKey: 'dashboard.childLabel',
    icon: '👶',
    score: 75,
    statusKey: 'dashboard.statusGood',
    color: '#22c55e',
    dimensions: [
      { key: 'emotion', labelKey: 'dashboard.dimEmotion', score: 70, tipKey: 'dashboard.tipEmotion' },
      { key: 'social',  labelKey: 'dashboard.dimSocial',  score: 65, tipKey: 'dashboard.tipSocial' },
      { key: 'sleep',   labelKey: 'dashboard.dimSleep',   score: 80, tipKey: 'dashboard.tipSleep' },
      { key: 'behavior',labelKey: 'dashboard.dimBehavior',score: 85, tipKey: 'dashboard.tipBehavior' },
    ],
  },
  caregiver: {
    key: 'caregiver',
    labelKey: 'dashboard.caregiverLabel',
    icon: '🧑‍🤝‍🧑',
    score: 60,
    statusKey: 'dashboard.statusNeedAttention',
    color: '#f59e0b',
    dimensions: [
      { key: 'stress',  labelKey: 'dashboard.dimStress',  score: 55, tipKey: 'dashboard.tipStress' },
      { key: 'energy',  labelKey: 'dashboard.dimEnergy',  score: 50, tipKey: 'dashboard.tipEnergy' },
      { key: 'support', labelKey: 'dashboard.dimSupport', score: 70, tipKey: 'dashboard.tipSupport' },
      { key: 'efficacy',labelKey: 'dashboard.dimEfficacy',score: 65, tipKey: 'dashboard.tipEfficacy' },
    ],
  },
};

/* ---- 环形进度圈 纯数字版 ---- */
const RingGauge = ({ score, color, size = 100, strokeWidth = 7 }) => {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      {/* 底色环 */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={strokeWidth}
      />
      {/* 进度弧 */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
      />
      {/* 中心数字 */}
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: size * 0.28, fontWeight: 800, fill: 'var(--spa-text)' }}
      >
        {score}
      </text>
    </svg>
  );
};

/* ---- 单个指标面板 ---- */
const GaugeCard = ({ item, t, onClick, locked }) => {
  const label = t(item.labelKey);
  const status = t(item.statusKey);

  return (
    <div
      onClick={onClick}
      style={{
        textAlign: 'center',
        cursor: 'pointer',
        padding: '0.75rem 0.5rem 0.5rem',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.6)',
        border: '1px solid var(--spa-line)',
        transition: 'all 160ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(28,44,62,0.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <RingGauge score={item.score} color={item.color} size={90} strokeWidth={7} />
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--spa-text)', marginTop: '0.3rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.7rem', color: item.color, fontWeight: 500, marginTop: '0.1rem' }}>
        {status}
      </div>
      {locked && (
        <div style={{ fontSize: '0.62rem', color: 'var(--spa-muted)', marginTop: '0.25rem', opacity: 0.7 }}>
          <IconLock style={{verticalAlign:'middle',marginRight:'0.2rem'}} />{t('dashboard.lockedHint')}
        </div>
      )}
    </div>
  );
};

/* ---- 主面板 ---- */
const DashboardPanel = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const tier = user?.tier || 'free';
  const canViewDetails = tier !== 'free';  // 中/高级可展开

  const [modalData, setModalData] = useState(null);
  const [tooltipTarget, setTooltipTarget] = useState(null);

  const handleClick = (item) => {
    if (canViewDetails) {
      setModalData({
        key: item.key,
        icon: item.icon,
        label: t(item.labelKey),
        score: item.score,
        status: t(item.statusKey),
        color: item.color,
        dimensions: item.dimensions.map((d) => ({
          ...d,
          label: t(d.labelKey),
          tip: t(d.tipKey),
        })),
      });
    } else {
      // 基础层：短暂提示后消失
      setTooltipTarget(item.key);
      setTimeout(() => setTooltipTarget(null), 1800);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* 标题行 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem' }}><IconDashboard style={{verticalAlign:'middle',color:'var(--spa-accent)'}} /></span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--spa-text)' }}>
          {t('dashboard.title')}
        </span>
      </div>

      {/* 两圈并排 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <GaugeCard
            item={DASHBOARD_DATA.child}
            t={t}
            locked={!canViewDetails}
            onClick={() => handleClick(DASHBOARD_DATA.child)}
          />
          {/* 基础层提示浮层 */}
          {tooltipTarget === 'child' && (
            <div
              style={{
                position: 'absolute', top: '-2.2rem', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(30,41,59,0.9)', color: '#fff', borderRadius: '8px',
                padding: '0.4rem 0.75rem', fontSize: '0.72rem', whiteSpace: 'nowrap',
                zIndex: 10, animation: 'fadeInUp 200ms ease-out',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {t('dashboard.upgradeToView')}
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <GaugeCard
            item={DASHBOARD_DATA.caregiver}
            t={t}
            locked={!canViewDetails}
            onClick={() => handleClick(DASHBOARD_DATA.caregiver)}
          />
          {tooltipTarget === 'caregiver' && (
            <div
              style={{
                position: 'absolute', top: '-2.2rem', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(30,41,59,0.9)', color: '#fff', borderRadius: '8px',
                padding: '0.4rem 0.75rem', fontSize: '0.72rem', whiteSpace: 'nowrap',
                zIndex: 10, animation: 'fadeInUp 200ms ease-out',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {t('dashboard.upgradeToView')}
            </div>
          )}
        </div>
      </div>

      {/* 维度详情弹窗 */}
      <DimensionModal data={modalData} onClose={() => setModalData(null)} />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DashboardPanel;
