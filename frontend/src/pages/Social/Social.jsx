import React, { useEffect, useRef, useState, useCallback } from 'react';
import { db } from '../../services/firebase';
import {
  addDoc, collection, deleteDoc, doc, getDocs,
  limit, onSnapshot, orderBy, query, serverTimestamp, startAfter, updateDoc, increment,
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import { useLanguage } from '../../i18n';
import { IconHeart, IconTrash, IconSeedling } from '../../components/common/Icons';

const PAGE_SIZE = 10;

/* ---- 相对时间 ---- */
function timeAgo(date) {
  const now = Date.now();
  const diff = now - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return '刚刚';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}小时前`;
  const day = Math.floor(hour / 24);
  if (day < 30) return `${day}天前`;
  return date.toLocaleDateString('zh-CN');
}

/* ---- tier标签配色 ---- */
const tierBadge = (tier, t) => {
  if (tier === 'premium') return { label: 'VIP', bg: 'rgba(37,99,235,0.12)', color: '#1d4ed8' };
  if (tier === 'mid') return { label: t('upgrade.tier.mid'), bg: 'rgba(100,116,139,0.1)', color: '#475569' };
  return null;
};

const Social = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [posting, setPosting] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const postsEndRef = useRef(null);

  /* ---- 实时监听最新一页 ---- */
  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }

    setLoading(true);
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(list);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
      setLoading(false);
    }, (err) => {
      console.error('posts listener error:', err);
      setLoading(false);
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.uid, navigate]);

  /* ---- 加载更多 ---- */
  const loadMore = useCallback(async () => {
    if (!lastDoc || loadingMore) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE),
      );
      const snap = await getDocs(q);
      const more = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts((prev) => [...prev, ...more]);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error('load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [lastDoc, loadingMore]);

  /* ---- 解析标签 #tag ---- */
  const parseTags = (raw) => {
    const matches = raw.match(/#[\w一-鿿]+/g);
    return matches ? [...new Set(matches)] : [];
  };

  /* ---- 发帖 ---- */
  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user || posting) return;
    setPosting(true);
    try {
      const tagList = parseTags(tags + ' ' + content);
      await addDoc(collection(db, 'posts'), {
        content: content.trim(),
        tags: tagList,
        userId: user.uid,
        userName: user.name || user.email?.split('@')[0] || t('social.defaultUser'),
        userTier: user.tier || 'free',
        likes: 0,
        createdAt: serverTimestamp(),
      });
      setContent('');
      setTags('');
      // onSnapshot 会自动拉取最新列表
    } catch (err) {
      console.error('post error:', err);
    } finally {
      setPosting(false);
    }
  };

  /* ---- 点赞 ---- */
  const handleLike = async (postId, currentLikes) => {
    try {
      const ref = doc(db, 'posts', postId);
      await updateDoc(ref, { likes: increment(1) });
      // 乐观更新
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p)));
    } catch (err) {
      console.error('like error:', err);
    }
  };

  /* ---- 删帖（仅自己的） ---- */
  const handleDelete = async (postId) => {
    if (!window.confirm('确定删除这条动态吗？')) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err) {
      console.error('delete error:', err);
    }
  };

  if (authLoading || !user) {
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

  return (
    <div className="min-h-screen pb-24 relative">
      {/* 顶栏 */}
      <nav className="top-nav-glass">
        <div className="max-w-full px-[80px] py-4 flex justify-between items-center">
          <div className="flex items-center shrink-0 min-w-0">
            <img src="/logo.jpg" alt="logo" className="w-auto max-h-[2.5rem] shrink-0 object-contain object-left rounded-lg" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xl" style={{ color: 'var(--spa-muted)' }}>
              {t('common.welcomeUser', { email: user.email })}
            </span>
          </div>
        </div>
      </nav>

      {/* 公告栏 */}
      <div className="max-w-full px-[80px] py-4">
        <div className="glass-card overflow-hidden anim-scale-in" style={{ height: 'clamp(10rem, 30vw, 13rem)' }}>
          <img src="/bulletin_board_1.jpg" alt={t('social.boardAlt')}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      </div>

      <div className="max-w-full px-[80px] py-4">
        <div className="max-w-2xl mx-auto">
          {/* 发帖区 */}
          <div className="glass-card p-6 mb-6 anim-slide-up">
            <form onSubmit={handlePost}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('social.postPlaceholder')}
                className="spa-input resize-none"
                style={{ minHeight: '90px', fontSize: '0.9rem' }}
                rows={3}
              />
              {/* 标签输入 */}
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder={t('social.tagsPlaceholder')}
                  className="spa-input"
                  style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                />
                <button type="submit" className="btn-primary" disabled={posting || !content.trim()}
                  style={{ padding: '0.45rem 1.2rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  {posting ? '…' : t('social.publish')}
                </button>
              </div>
            </form>
          </div>

          {/* 帖子列表 */}
          <div className="anim-slide-up" style={{ animationDelay: '60ms' }}>
            <div className="text-center mb-5">
              <h2 className="text-2xl font-semibold" style={{ fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif' }}>
                {t('social.community')}
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--spa-accent)', borderTopColor: 'transparent' }} />
              </div>
            ) : posts.length === 0 ? (
              <div className="glass-card p-12 text-center anim-scale-in">
                <IconSeedling style={{color:'var(--spa-accent)',width:48,height:48}} />
                <p className="text-lg mb-2" style={{ color: 'var(--spa-text)', fontWeight: 600 }}>
                  {t('social.emptyTitle')}
                </p>
                <p className="text-sm" style={{ color: 'var(--spa-muted)' }}>
                  {t('social.emptyHint')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post, idx) => {
                  const badge = tierBadge(post.userTier, t);
                  const userInitial = (post.userName || 'U').charAt(0).toUpperCase();
                  const postTags = post.tags || [];
                  return (
                    <div key={post.id} className="post-card anim-slide-up"
                      style={{ animationDelay: `${idx * 40}ms`, padding: '1rem 1.2rem' }}>
                      {/* 头部 */}
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, rgba(122,154,184,0.3), rgba(168,156,200,0.3))', color: 'var(--spa-accent-strong)' }}>
                          {userInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm" style={{ color: 'var(--spa-text)' }}>
                              {post.userName}
                            </span>
                            {badge && (
                              <span style={{
                                fontSize: '0.62rem', fontWeight: 600, borderRadius: '4px',
                                padding: '0.05rem 0.35rem', background: badge.bg, color: badge.color,
                              }}>
                                {badge.label}
                              </span>
                            )}
                            <span className="text-xs" style={{ color: 'var(--spa-muted)', marginLeft: 'auto' }}>
                              {post.createdAt ? timeAgo(post.createdAt.toDate()) : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 正文 */}
                      <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--spa-text)' }}>
                        {post.content}
                      </p>

                      {/* 标签 */}
                      {postTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {postTags.map((tag) => (
                            <span key={tag} style={{
                              fontSize: '0.68rem', color: 'var(--spa-accent)',
                              background: 'rgba(37,99,235,0.06)', borderRadius: '6px',
                              padding: '0.1rem 0.5rem',
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 底部操作栏 */}
                      <div className="flex items-center gap-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.5rem' }}>
                        <button onClick={() => handleLike(post.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--spa-muted)', padding: '0.2rem 0.3rem', borderRadius: '6px', transition: 'all 120ms' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--spa-muted)'; }}
                        >
                          <IconHeart style={{verticalAlign:'middle'}} /> <span style={{ fontWeight: 600 }}>{post.likes || 0}</span>
                        </button>

                        {post.userId === user.uid && (
                          <button onClick={() => handleDelete(post.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: 'var(--spa-muted)', marginLeft: 'auto', padding: '0.2rem 0.3rem' }}>
                            <IconTrash style={{verticalAlign:'middle'}} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* 加载更多 */}
                {hasMore && (
                  <div className="text-center py-4">
                    <button onClick={loadMore} disabled={loadingMore}
                      className="btn-ghost"
                      style={{ padding: '0.5rem 2rem', fontSize: '0.82rem', cursor: loadingMore ? 'wait' : 'pointer' }}>
                      {loadingMore ? t('common.loading') : t('social.loadMore')}
                    </button>
                  </div>
                )}
                <div ref={postsEndRef} />
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
