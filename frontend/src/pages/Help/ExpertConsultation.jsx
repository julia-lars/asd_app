import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import { useLanguage } from '../../i18n';

const SESSION_LIMITS = { free: 0, mid: 0, premium: 2 };

const DOCTORS = [
  {
    id: 1,
    nameKey: 'counseling.doctor1Name',
    titleKey: 'counseling.doctor1Title',
    descKey: 'counseling.doctor1Desc',
    avatar: '👩‍⚕️',
  },
  {
    id: 2,
    nameKey: 'counseling.doctor2Name',
    titleKey: 'counseling.doctor2Title',
    descKey: 'counseling.doctor2Desc',
    avatar: '👨‍⚕️',
  },
  {
    id: 3,
    nameKey: 'counseling.doctor3Name',
    titleKey: 'counseling.doctor3Title',
    descKey: 'counseling.doctor3Desc',
    avatar: '👩‍⚕️',
  },
];

const ExpertConsultation = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [bookedDoctor, setBookedDoctor] = useState(null);
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

  const handleBook = (doctorId) => {
    setBookedDoctor(doctorId);
    setTimeout(() => setBookedDoctor(null), 2500);
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
              <span style={{ fontSize: '1.3rem' }}>💼</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--spa-text)', margin: 0 }}>
                {t('counseling.expertTitle')}
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

            {/* 医生名片 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {DOCTORS.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card"
                  style={{
                    borderRadius: '16px', padding: '1rem 1.2rem',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    transition: 'all 160ms ease',
                  }}
                >
                  {/* 头像 */}
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', flexShrink: 0,
                  }}>
                    {doc.avatar}
                  </div>

                  {/* 信息 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--spa-text)', marginBottom: '0.15rem' }}>
                      {t(doc.nameKey)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--spa-accent)', fontWeight: 500, marginBottom: '0.25rem' }}>
                      {t(doc.titleKey)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--spa-muted)', lineHeight: 1.4 }}>
                      {t(doc.descKey)}
                    </div>
                  </div>

                  {/* 预约键 */}
                  <button
                    onClick={() => handleBook(doc.id)}
                    style={{
                      flexShrink: 0,
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#fff',
                      background: bookedDoctor === doc.id
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      boxShadow: '0 3px 12px rgba(37,99,235,0.2)',
                      transition: 'all 160ms ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {bookedDoctor === doc.id ? '✓ ' + t('counseling.booked') : t('counseling.bookExpert')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 预约成功 toast */}
      {bookedDoctor && (
        <div style={{
          position: 'fixed', bottom: '6rem', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(34,197,94,0.95)', color: '#fff', borderRadius: '12px',
          padding: '0.7rem 1.5rem', fontSize: '0.85rem', fontWeight: 600,
          zIndex: 9999, boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
          animation: 'fadeInUp 300ms ease-out',
        }}>
          ✅ {t('counseling.expertBookedToast')}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
      <BottomNav />
    </div>
  );
};

export default ExpertConsultation;
