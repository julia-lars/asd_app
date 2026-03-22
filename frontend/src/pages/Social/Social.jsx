import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';

const TEXT = {
  loading: '\u52a0\u8f7d\u4e2d...',
  welcome: '\u6b22\u8fce',
  defaultUser: '\u7528\u6237',
  boardAlt: '\u516c\u544a\u680f\u56fe\u7247',
  postTitle: '\u53d1\u5e03\u65b0\u52a8\u6001',
  postPlaceholder: '\u5206\u4eab\u4f60\u7684\u7ecf\u9a8c\u548c\u611f\u53d7...',
  publish: '\u53d1\u5e03',
  community: '\u793e\u533a\u52a8\u6001',
  empty: '\u8fd8\u6ca1\u6709\u52a8\u6001\uff0c\u5feb\u6765\u53d1\u5e03\u7b2c\u4e00\u6761\u5427\uff01'
};

const Social = () => {
  const { user, loading: authLoading } = useAuth();
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
        userName: user.displayName || TEXT.defaultUser,
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
    return <div className="flex items-center justify-center h-screen text-2xl">{TEXT.loading}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24 relative">
      <nav className="app-top-nav bg-white shadow-md">
        <div className="max-w-full px-[80px] py-4 flex justify-between items-center">
          <div className="flex items-center shrink-0 min-w-0">
            <img
              src="/logo.jpg"
              alt="logo"
              className="w-auto max-h-[2.5rem] shrink-0 object-contain object-left"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xl text-gray-700">{TEXT.welcome}, {user.email}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-full px-[80px] py-4">
        <div className="w-full h-64 bg-gray-200 border-2 border-blue-500 flex items-center justify-center">
          <img
            src="/bulletin_board_1.jpg"
            alt={TEXT.boardAlt}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              console.error('Image load failed:', e.currentTarget.src);
              e.currentTarget.src = 'https://via.placeholder.com/800x300?text=%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%A4%B1%E8%B4%A5';
            }}
          />
        </div>
      </div>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">{TEXT.postTitle}</h2>
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={TEXT.postPlaceholder}
                className="w-full border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
                rows={4}
              />
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-3 px-8 rounded-md hover:bg-blue-600 transition-colors text-xl"
                >
                  {TEXT.publish}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold p-6 border-b text-center">{TEXT.community}</h2>
            {posts.length === 0 ? (
              <div className="p-10 text-center text-gray-500 text-xl">{TEXT.empty}</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="p-6 border-b last:border-0">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800 text-xl">{post.userName}</h3>
                      <span className="text-gray-400 text-lg">
                        {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xl">{post.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Social;
