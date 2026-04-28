import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';

const TEXT = {
  loading: '加载中...',
  welcome: '欢迎',
  title: '帮助中心',
  faq: '常见问题',
  faqHint: '点击跳转至文献知识图谱专页（全屏可缩放、筛选）',
  faqText: '这里提供孤独症相关的常见问题解答，帮助您更好地了解孤独症。',
  resources: '资源链接',
  resourcesText: '提供专业的孤独症相关资源和支持机构链接。',
  contact: '联系我们',
  contactText: '如果您有任何问题或建议，欢迎联系我们。'
};

const Help = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl" style={{ color: 'var(--spa-muted)' }}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--spa-accent)', borderTopColor: 'transparent' }}
          />
          {TEXT.loading}
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
              {TEXT.welcome}, {user.email}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 mb-8 anim-scale-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold" style={{ fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}>
                {TEXT.title}
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
                        {TEXT.faq}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--spa-muted)' }}>
                      {TEXT.faqText}
                    </p>
                    <p className="text-xs font-medium flex items-center gap-1"
                      style={{ color: 'var(--spa-accent-strong)' }}
                    >
                      <span>🔍</span>
                      {TEXT.faqHint}
                      <span>→</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-xl flex items-center justify-center" style={{ color: 'var(--spa-accent)' }}>
                    ◈
                  </div>
                </div>
              </button>

              <div className="help-item anim-slide-up"
                style={{ animationDelay: '60ms' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🔗</span>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--spa-text)' }}>
                    {TEXT.resources}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--spa-muted)' }}>
                  {TEXT.resourcesText}
                </p>
              </div>

              <div className="help-item anim-slide-up"
                style={{ animationDelay: '120ms' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">📧</span>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--spa-text)' }}>
                    {TEXT.contact}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--spa-muted)' }}>
                  {TEXT.contactText}
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
