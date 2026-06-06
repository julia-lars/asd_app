import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import { useLanguage } from '../../i18n';

const TOOLBOX_LINKS = {
  audio: 'https://www.ximalaya.com/search/%E5%86%A5%E6%83%B3%E6%94%BE%E6%9D%BE',
  video: 'https://www.bilibili.com/search?keyword=%E5%91%BC%E5%90%B8%E6%94%BE%E6%9D%BE%E7%BB%83%E4%B9%A0',
};

const Help = () => {
  const { user, loading } = useAuth();
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
                {t('help.title')}
              </h2>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => navigate('/help/knowledge-graph')}
                className="help-item w-full text-left anim-slide-up"
                style={{ animationDelay: '0ms' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">❓</span>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--spa-text)' }}>
                        {t('help.faq')}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--spa-muted)' }}>
                      {t('help.faqText')}
                    </p>
                    <p className="text-xs font-medium flex items-center gap-1"
                      style={{ color: 'var(--spa-accent-strong)' }}
                    >
                      <span>🔍</span>
                      {t('help.faqHint')}
                      <span>→</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-xl flex items-center justify-center" style={{ color: 'var(--spa-accent)' }}>
                    ◈
                  </div>
                </div>
              </button>

              <div className="help-item help-toolbox anim-slide-up"
                style={{ animationDelay: '60ms' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🧰</span>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--spa-text)' }}>
                    {t('help.toolbox')}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--spa-muted)' }}>
                  {t('help.toolboxText')}
                </p>
                <div className="toolbox-link-grid" aria-label={t('help.toolboxLinksLabel')}>
                  <a
                    className="toolbox-link-slot"
                    href={TOOLBOX_LINKS.audio}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="toolbox-link-icon">🎧</span>
                    <span className="toolbox-link-copy">
                      <span className="toolbox-link-title">{t('help.toolboxAudio')}</span>
                      <span className="toolbox-link-note">{t('help.toolboxOpen')}</span>
                    </span>
                  </a>
                  <a
                    className="toolbox-link-slot"
                    href={TOOLBOX_LINKS.video}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="toolbox-link-icon">🎬</span>
                    <span className="toolbox-link-copy">
                      <span className="toolbox-link-title">{t('help.toolboxVideo')}</span>
                      <span className="toolbox-link-note">{t('help.toolboxOpen')}</span>
                    </span>
                  </a>
                </div>
              </div>

              <div className="help-item anim-slide-up"
                style={{ animationDelay: '120ms' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🔗</span>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--spa-text)' }}>
                    {t('help.resources')}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--spa-muted)' }}>
                  {t('help.resourcesText')}
                </p>
              </div>

              <div className="help-item anim-slide-up"
                style={{ animationDelay: '180ms' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">📧</span>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--spa-text)' }}>
                    {t('help.contact')}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--spa-muted)' }}>
                  {t('help.contactText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Help;
