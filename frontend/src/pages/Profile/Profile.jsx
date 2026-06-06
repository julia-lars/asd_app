import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { useLanguage } from '../../i18n';

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl" style={{ color: 'var(--spa-muted)' }}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--spa-accent)', borderTopColor: 'transparent' }}
          />
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen pb-24">
      <nav className="top-nav-glass">
        <div className="max-w-full px-[80px] py-4 flex justify-between items-center">
          <div className="flex items-center shrink-0 min-w-0">
            <img
              src="/logo.jpg"
              alt="logo"
              className="w-auto max-h-[2.5rem] shrink-0 object-contain object-left rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xl" style={{ color: 'var(--spa-muted)' }}>
              {t('common.welcomeUser', { email: user.email })}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 mb-8 anim-scale-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold" style={{ fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}>
                {t('profile.title')}
              </h2>
            </div>

            <div className="space-y-8">
              <div className="profile-section anim-slide-up" style={{ animationDelay: '0ms' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base">📋</span>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--spa-text)' }}>{t('profile.profile')}</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--spa-muted)', minWidth: '4rem' }}>
                      {t('profile.email')}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--spa-text)' }}>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--spa-muted)', minWidth: '4rem' }}>
                      {t('profile.uid')}
                    </span>
                    <span className="text-xs font-mono truncate" style={{ color: 'var(--spa-text)' }}>
                      {user.uid}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-section anim-slide-up" style={{ animationDelay: '60ms' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base">⚙️</span>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--spa-text)' }}>{t('profile.settings')}</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm">🌐</span>
                      <span className="text-sm" style={{ color: 'var(--spa-muted)' }}>{t('profile.language')}</span>
                    </div>
                    <LanguageSwitcher align="flex-start" />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                  >
                    <span className="text-sm">🔑</span>
                    <span className="text-sm" style={{ color: 'var(--spa-muted)' }}>{t('profile.resetPwd')}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                  >
                    <span className="text-sm">📱</span>
                    <span className="text-sm" style={{ color: 'var(--spa-muted)' }}>{t('profile.bindPhone')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 anim-slide-up" style={{ animationDelay: '120ms' }}>
                <button onClick={handleLogout} className="btn-danger w-full">
                  {t('profile.logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
