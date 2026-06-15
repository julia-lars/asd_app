import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import { useLanguage } from '../../i18n';

const COMMUNITY_EXAMPLE_MESSAGES = [
  {
    userName: 'User1',
    content: '“We have another dentist appointment tomorrow. Last time, my son wouldn’t even sit in the chair.”',
  },
  {
    userName: 'User2',
    content: '“I feel you. We went through three dentists before finding one who understood sensory meltdowns.”',
  },
  {
    userName: 'User1',
    content: '“I barely slept last night. Sometimes I wonder if I’m even helping him or just surviving.”',
  },
  {
    userName: 'User3',
    content: '“You’re not alone. Be kind to yourself.”',
  },
];

const Social = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, formatDateTime } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [authLoading, user, navigate]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    try {
      await addDoc(collection(db, 'posts'), {
        content,
        userId: user.uid,
        userName: user.displayName || t('social.defaultUser'),
        createdAt: serverTimestamp()
      });
      setContent('');

      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (authLoading || loading) {
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
    return null;
  }

  return (
    <div className="min-h-screen pb-24 relative">
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

      <div className="max-w-full px-[80px] py-4">
        <div className="glass-card overflow-hidden anim-scale-in"
          style={{ height: 'clamp(12rem, 38vw, 16rem)' }}
        >
          <img
            src="/bulletin_board_1.jpg"
            alt={t('social.boardAlt')}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image load failed:', e.currentTarget.src);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 mb-8 anim-slide-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold" style={{ fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}>
                {t('social.postTitle')}
              </h2>
            </div>
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('social.postPlaceholder')}
                className="spa-input resize-none"
                style={{ minHeight: '100px' }}
                rows={4}
              />
              <div className="mt-5 flex justify-end">
                <button type="submit" className="btn-primary">
                  {t('social.publish')}
                </button>
              </div>
            </form>
          </div>

          <div className="anim-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="text-center mb-5">
              <h2 className="text-2xl font-semibold" style={{ fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}>
                {t('social.community')}
              </h2>
            </div>

            <div className="community-example-card anim-slide-up" style={{ animationDelay: '80ms' }}>
              <div className="community-thread" aria-label="社区对话">
                {COMMUNITY_EXAMPLE_MESSAGES.map((message, index) => (
                  <div key={`${message.userName}-${index}`} className="community-message">
                    <div className="community-speaker">
                      {message.userName.replace('User', 'U')}
                    </div>
                    <div className="community-message-bubble">
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="glass-card p-10 text-center anim-scale-in">
                <div className="text-4xl mb-3">🌿</div>
                <p className="text-lg" style={{ color: 'var(--spa-muted)' }}>{t('social.empty')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post, index) => (
                  <div key={post.id} className="post-card anim-slide-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                        style={{
                          background: 'linear-gradient(135deg, rgba(122,154,184,0.25), rgba(168,156,200,0.25))',
                          color: 'var(--spa-accent-strong)'
                        }}
                      >
                        {post.userName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-base truncate" style={{ color: 'var(--spa-text)' }}>
                            {post.userName}
                          </h3>
                          <span className="text-xs shrink-0" style={{ color: 'var(--spa-muted)' }}>
                            {post.createdAt ? formatDateTime(new Date(post.createdAt.toDate())) : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed pl-12" style={{ color: 'var(--spa-muted)' }}>
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Social;
