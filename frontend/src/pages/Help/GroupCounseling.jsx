import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import { useLanguage } from '../../i18n';

const TIME_SLOTS = ['18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'];

const SESSION_LIMITS = { free: 0, mid: 4, premium: 8 };

const GroupCounseling = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [booked, setBooked] = useState(null);
  const tier = user?.tier || 'free';
  const limit = SESSION_LIMITS[tier] || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl" style={{ color: 'var(--spa-muted)' }}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--spa-accent)', borderTopColor: 'transparent' }} />
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (!user) { navigate('/login'); return null; }

  const handleBook = (slot) => {
    setBooked(slot);
    setTimeout(() => setBooked(null), 2500);
  };

  return (
    <div className="min-h-screen pb-24">
      <nav className="top-nav-glass">
        <div className="max-w-full px-[80px] py-4 flex justify-between items-center">
          <div className="flex items-center shrink-0 min-w-0">
            <img src="/logo.jpg" alt="logo" className="w-auto max-h-[2.5rem] shrink-0 object-contain object-left rounded-lg" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xl" style={{ color: 'var(--spa-muted)' }}>{t('common.welcomeUser', { email: user.email })}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 anim-scale-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button onClick={() => navigate('/help')} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem',
                color: 'var(--spa-muted)', padding: 0, lineHeight: 1,
              }}>←</button>
              <span style={{ fontSize: '1.3rem' }}>👥</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--spa-text)', margin: 0 }}>
                {t('counseling.groupTitle')}
              </h2>
            </div>

            {/* 剩余次数 */}
            <div className="glass-card" style={{
              borderRadius: '14px', padding: '0.9rem 1.2rem', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--spa-muted)' }}>{t('counseling.remaining')}</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--spa-accent)' }}>
                {limit} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--spa-muted)' }}>{t('counseling.perMonth')}</span>
              </span>
            </div>

            {/* 日历简表：显示接下来 7 天 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--spa-text)', marginBottom: '0.6rem' }}>
                📅 {t('counseling.availableSlots')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem', marginBottom: '1rem' }}>
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const day = d.getDate();
                  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
                  const isToday = i === 0;
                  return (
                    <div key={i} style={{
                      textAlign: 'center', padding: '0.4rem 0.2rem', borderRadius: '10px',
                      background: isToday ? 'rgba(37,99,235,0.1)' : 'transparent',
                      border: isToday ? '1.5px solid var(--spa-accent)' : '1px solid transparent',
                    }}>
                      <div style={{ fontSize: '0.6rem', color: 'var(--spa-muted)' }}>{weekDay}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: isToday ? 700 : 500, color: 'var(--spa-text)' }}>{day}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 时间段 */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--spa-text)', marginBottom: '0.6rem' }}>
                🕐 {t('counseling.timeSlots')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => handleBook(slot)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.85rem 1.2rem', borderRadius: '14px',
                      border: '1px solid var(--spa-line)',
                      background: booked === slot ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.7)',
                      cursor: 'pointer', transition: 'all 160ms ease',
                      textAlign: 'left', width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: booked === slot ? '#22c55e' : 'var(--spa-accent)',
                      }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--spa-text)' }}>{slot}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: booked === slot ? '#16a34a' : 'var(--spa-accent)' }}>
                      {booked === slot ? '✓ ' + t('counseling.booked') : t('counseling.book')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 预约成功 toast */}
      {booked && (
        <div style={{
          position: 'fixed', bottom: '6rem', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(34,197,94,0.95)', color: '#fff', borderRadius: '12px',
          padding: '0.7rem 1.5rem', fontSize: '0.85rem', fontWeight: 600,
          zIndex: 9999, boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
          animation: 'fadeInUp 300ms ease-out',
        }}>
          ✅ {t('counseling.bookedToast', { slot: booked })}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
      <BottomNav />
    </div>
  );
};

export default GroupCounseling;
