import React from 'react';
import { useLanguage } from '../../i18n';

const DimensionModal = ({ data, onClose }) => {
  const { t } = useLanguage();
  if (!data) return null;

  const statusColor = (score) => {
    if (score >= 86) return '#22c55e';
    if (score >= 61) return '#3b82f6';
    if (score >= 31) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2147483645,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: 'min(480px, 100vw)',
          maxHeight: '80dvh',
          overflow: 'auto',
          borderRadius: '20px 20px 0 0',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))',
          boxShadow: '0 -6px 30px rgba(28,44,62,0.16)',
          padding: '1.2rem 1.2rem calc(1.2rem + env(safe-area-inset-bottom))',
          animation: 'slideUp 250ms ease-out',
        }}
      >
        {/* 拖拽条 */}
        <div style={{ width: 32, height: 3, borderRadius: 2, background: 'var(--spa-line)', margin: '0 auto 0.8rem' }} />

        {/* 头部信息 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.3rem' }}>{data.icon}</span>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--spa-text)' }}>
              {data.label} · <span style={{ color: data.color }}>{data.score} 分</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--spa-muted)', marginLeft: '0.3rem' }}>{data.status}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto', width: 28, height: 28, borderRadius: '50%',
              border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer',
              fontSize: '0.85rem', color: 'var(--spa-muted)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* 各维度 */}
        {data.dimensions.map((dim) => {
          const barColor = statusColor(dim.score);
          return (
            <div key={dim.key} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--spa-text)' }}>{dim.label}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: barColor }}>{dim.score}</span>
              </div>
              {/* 进度条 */}
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '0.35rem' }}>
                <div style={{
                  height: '100%', borderRadius: 3, background: barColor,
                  width: `${dim.score}%`,
                  transition: 'width 400ms ease-out',
                }} />
              </div>
              {/* 分析文案 */}
              <p style={{ fontSize: '0.72rem', color: 'var(--spa-muted)', lineHeight: 1.5, margin: 0 }}>
                {dim.tip}
              </p>
            </div>
          );
        })}

        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DimensionModal;
