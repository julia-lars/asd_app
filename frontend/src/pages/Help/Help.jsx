import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import { useLanguage } from '../../i18n';
import { IconKnowledge, IconToolbox, IconResources, IconContact, IconGroup, IconExpert, IconSearch, IconAudio, IconVideo, IconChevronDown, IconExternal, IconLock } from '../../components/common/Icons';

const SESSION_LIMITS = {
  group:  { free: 0, mid: 4, premium: 8 },
  expert: { free: 0, mid: 0, premium: 2 },
};

const TOOLBOX_LINKS = {
  audio: 'https://www.ximalaya.com/search/%E5%86%A5%E6%83%B3%E6%94%BE%E6%9D%BE',
  video: 'https://www.bilibili.com/search?keyword=%E5%91%BC%E5%90%B8%E6%94%BE%E6%9D%BE%E7%BB%83%E4%B9%A0',
};

const Help = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const tier = user?.tier || 'free';
  const [toolboxOpen, setToolboxOpen] = useState(true);
  const [kgOpen, setKgOpen] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(true);

  const groupRemaining = SESSION_LIMITS.group[tier] || 0;
  const expertRemaining = SESSION_LIMITS.expert[tier] || 0;
  const canGroup = groupRemaining > 0;
  const canExpert = expertRemaining > 0;

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
              {/* ===== 知识图谱（一级标题 + 二级子项）===== */}
              <div className="anim-slide-up" style={{ animationDelay: '0ms' }}>
                <button
                  onClick={() => setKgOpen((v) => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
                    padding: '0.85rem 1rem', borderRadius: '14px',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: kgOpen
                      ? 'rgba(37,99,235,0.06)'
                      : 'rgba(255,255,255,0.5)',
                    borderLeft: kgOpen ? '3px solid var(--spa-accent)' : '3px solid transparent',
                    transition: 'all 200ms ease',
                  }}
                >
                  <IconKnowledge style={{color:'var(--spa-accent)'}} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--spa-text)', margin: 0, flex: 1 }}>
                    {t('help.kgTitle')}
                  </h3>
                  <span style={{
                    fontSize: '0.8rem', color: 'var(--spa-muted)',
                    transform: kgOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}>
                    <IconChevronDown style={{verticalAlign:'middle'}} />
                  </span>
                </button>

                {kgOpen && (
                  <div style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                    <div
                      onClick={() => navigate('/help/knowledge-graph')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.7rem 0.9rem', borderRadius: '12px',
                        border: '1px solid var(--spa-line)',
                        background: 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        transition: 'all 160ms ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(28,44,62,0.06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <IconSearch style={{color:'var(--spa-accent)',flexShrink:0}} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--spa-text)' }}>
                          {t('help.kgLabel')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--spa-muted)', marginTop: '0.1rem', lineHeight: 1.3 }}>
                          {t('help.kgDesc')}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--spa-muted)' }}>
                        {t('help.toolboxOpen')} <IconExternal style={{verticalAlign:'middle'}} />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ===== 工具箱（一级标题 + 二级子项）===== */}
              <div className="anim-slide-up" style={{ animationDelay: '60ms' }}>
                <button
                  onClick={() => setToolboxOpen((v) => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
                    padding: '0.85rem 1rem', borderRadius: '14px',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: toolboxOpen
                      ? 'rgba(37,99,235,0.06)'
                      : 'rgba(255,255,255,0.5)',
                    borderLeft: toolboxOpen ? '3px solid var(--spa-accent)' : '3px solid transparent',
                    transition: 'all 200ms ease',
                  }}
                >
                  <IconToolbox style={{color:'var(--spa-accent)'}} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--spa-text)', margin: 0, flex: 1 }}>
                    {t('help.toolbox')}
                  </h3>
                  <span style={{
                    fontSize: '0.8rem', color: 'var(--spa-muted)',
                    transform: toolboxOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}>
                    <IconChevronDown style={{verticalAlign:'middle'}} />
                  </span>
                </button>

                {toolboxOpen && (
                  <div style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[{ key: 'audio', icon: <IconAudio style={{color:'var(--spa-accent)',flexShrink:0}} />, labelKey: 'help.toolboxAudio', url: TOOLBOX_LINKS.audio },
                      { key: 'video', icon: <IconVideo style={{color:'var(--spa-accent)',flexShrink:0}} />, labelKey: 'help.toolboxVideo', url: TOOLBOX_LINKS.video }]
                      .map((item) => (
                        <a
                          key={item.key}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.7rem 0.9rem', borderRadius: '12px',
                            border: '1px solid var(--spa-line)',
                            background: 'rgba(255,255,255,0.7)',
                            cursor: 'pointer', textDecoration: 'none',
                            transition: 'all 160ms ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(28,44,62,0.06)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          {item.icon}
                          <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--spa-text)', flex: 1 }}>
                            {t(item.labelKey)}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--spa-muted)' }}>
                            {t('help.toolboxOpen')} <IconExternal style={{verticalAlign:'middle'}} />
                          </span>
                        </a>
                      ))}
                  </div>
                )}
              </div>

              {/* ===== 资源链接（一级标题 + 二级子项）===== */}
              <div className="anim-slide-up" style={{ animationDelay: '120ms' }}>
                {/* 一级标题 */}
                <button
                  onClick={() => setResourcesOpen((v) => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
                    padding: '0.85rem 1rem', borderRadius: '14px',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: resourcesOpen
                      ? 'rgba(37,99,235,0.06)'
                      : 'rgba(255,255,255,0.5)',
                    borderLeft: '3px solid var(--spa-accent)',
                    transition: 'all 200ms ease',
                  }}
                >
                  <IconResources style={{color:'var(--spa-accent)'}} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--spa-text)', margin: 0, flex: 1 }}>
                    {t('help.resources')}
                  </h3>
                  <span style={{
                    fontSize: '0.8rem', color: 'var(--spa-muted)',
                    transform: resourcesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}>
                    <IconChevronDown style={{verticalAlign:'middle'}} />
                  </span>
                </button>

                {/* 二级子项容器 */}
                {resourcesOpen && (
                  <div style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* 团体咨询 */}
                    <div
                      onClick={canGroup ? () => navigate('/help/group-counseling') : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.7rem 0.9rem', borderRadius: '12px',
                        border: '1px solid var(--spa-line)',
                        background: canGroup ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.03)',
                        cursor: canGroup ? 'pointer' : 'not-allowed',
                        opacity: canGroup ? 1 : 0.45,
                        transition: 'all 160ms ease',
                      }}
                      onMouseEnter={canGroup ? (e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(28,44,62,0.06)'; } : undefined}
                      onMouseLeave={canGroup ? (e) => { e.currentTarget.style.boxShadow = 'none'; } : undefined}
                    >
                      <IconGroup style={{color:'var(--spa-accent)',flexShrink:0}} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: canGroup ? 'var(--spa-text)' : 'var(--spa-muted)' }}>
                          {t('counseling.groupTitle')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--spa-muted)', marginTop: '0.1rem', lineHeight: 1.3 }}>
                          {t('counseling.groupDesc')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: canGroup ? 'var(--spa-accent)' : 'var(--spa-muted)' }}>
                          {groupRemaining}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: 'var(--spa-muted)', display: 'block' }}>
                          {t('counseling.perMonth')}
                        </span>
                        {!canGroup && (
                          <span style={{ fontSize: '0.58rem', color: '#ef4444', display: 'block' }}><IconLock style={{verticalAlign:'middle'}} /></span>
                        )}
                      </div>
                    </div>

                    {/* 一对一专家咨询 */}
                    <div
                      onClick={canExpert ? () => navigate('/help/expert-consultation') : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.7rem 0.9rem', borderRadius: '12px',
                        border: '1px solid var(--spa-line)',
                        background: canExpert ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.03)',
                        cursor: canExpert ? 'pointer' : 'not-allowed',
                        opacity: canExpert ? 1 : 0.45,
                        transition: 'all 160ms ease',
                      }}
                      onMouseEnter={canExpert ? (e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(28,44,62,0.06)'; } : undefined}
                      onMouseLeave={canExpert ? (e) => { e.currentTarget.style.boxShadow = 'none'; } : undefined}
                    >
                      <IconExpert style={{color:'var(--spa-accent)',flexShrink:0}} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: canExpert ? 'var(--spa-text)' : 'var(--spa-muted)' }}>
                          {t('counseling.expertTitle')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--spa-muted)', marginTop: '0.1rem', lineHeight: 1.3 }}>
                          {t('counseling.expertDesc')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: canExpert ? 'var(--spa-accent)' : 'var(--spa-muted)' }}>
                          {expertRemaining}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: 'var(--spa-muted)', display: 'block' }}>
                          {t('counseling.perMonth')}
                        </span>
                        {!canExpert && (
                          <span style={{ fontSize: '0.58rem', color: '#ef4444', display: 'block' }}><IconLock style={{verticalAlign:'middle'}} /></span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ===== 联系我们（一级标题 + 二级子项）===== */}
              <div className="anim-slide-up" style={{ animationDelay: '180ms' }}>
                <button
                  onClick={() => setContactOpen((v) => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
                    padding: '0.85rem 1rem', borderRadius: '14px',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: contactOpen
                      ? 'rgba(37,99,235,0.06)'
                      : 'rgba(255,255,255,0.5)',
                    borderLeft: contactOpen ? '3px solid var(--spa-accent)' : '3px solid transparent',
                    transition: 'all 200ms ease',
                  }}
                >
                  <IconContact style={{color:'var(--spa-accent)'}} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--spa-text)', margin: 0, flex: 1 }}>
                    {t('help.contact')}
                  </h3>
                  <span style={{
                    fontSize: '0.8rem', color: 'var(--spa-muted)',
                    transform: contactOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}>
                    <IconChevronDown style={{verticalAlign:'middle'}} />
                  </span>
                </button>

                {contactOpen && (
                  <div style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* 公众号 */}
                    <a
                      href="https://mp.weixin.qq.com/s/spectralink"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.7rem 0.9rem', borderRadius: '12px',
                        border: '1px solid var(--spa-line)',
                        background: 'rgba(255,255,255,0.7)',
                        cursor: 'pointer', textDecoration: 'none',
                        transition: 'all 160ms ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(28,44,62,0.06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700,
                        color: '#fff', background: '#07c160',
                        borderRadius: '6px', padding: '0.2rem 0.45rem',
                        flexShrink: 0,
                      }}>
                        {t('help.wechat')}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--spa-text)', flex: 1 }}>
                        SpectraLink
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--spa-muted)' }}>
                        {t('help.toolboxOpen')} <IconExternal style={{verticalAlign:'middle'}} />
                      </span>
                    </a>

                    {/* 小红书（预留） */}
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.7rem 0.9rem', borderRadius: '12px',
                        border: '1px solid var(--spa-line)',
                        background: 'rgba(0,0,0,0.02)',
                        opacity: 0.5,
                      }}
                    >
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700,
                        color: '#fff', background: '#ff2442',
                        borderRadius: '6px', padding: '0.2rem 0.45rem',
                        flexShrink: 0,
                      }}>
                        {t('help.xiaohongshu')}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--spa-muted)', flex: 1 }}>
                        {t('help.comingSoon')}
                      </span>
                    </div>

                    {/* 抖音（预留） */}
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.7rem 0.9rem', borderRadius: '12px',
                        border: '1px solid var(--spa-line)',
                        background: 'rgba(0,0,0,0.02)',
                        opacity: 0.5,
                      }}
                    >
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700,
                        color: '#fff', background: '#000',
                        borderRadius: '6px', padding: '0.2rem 0.45rem',
                        flexShrink: 0,
                      }}>
                        {t('help.douyin')}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--spa-muted)', flex: 1 }}>
                        {t('help.comingSoon')}
                      </span>
                    </div>
                  </div>
                )}
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
