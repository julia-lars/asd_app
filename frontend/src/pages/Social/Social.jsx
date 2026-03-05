import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import ImageCarousel from '../../components/common/ImageCarousel';

const Social = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, navigate]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        content,
        userId: user.uid,
        userName: user.displayName || 'User',
        createdAt: serverTimestamp()
      });
      setContent('');
      // 重新获取帖子列表
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-2xl">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <nav className="bg-white shadow-md">
        <div className="max-w-full px-[80px] py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">孤独症支持平台</h1>
          <div className="flex items-center space-x-4">
            <span className="text-xl text-gray-700">欢迎, {user.email}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-full px-[80px] py-4">
        <div className="w-full h-64 bg-gray-200 border-2 border-blue-500 flex items-center justify-center">
          <img 
            src="/bulletin_board_1.jpg" 
            alt="测试图片" 
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              console.error('图片加载失败:', e.target.src);
              e.target.src = 'https://via.placeholder.com/800x300?text=图片加载失败';
            }}
          />
        </div>
      </div>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">发布新动态</h2>
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="分享你的经验和感受..."
                className="w-full border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
                rows={4}
              ></textarea>
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-3 px-8 rounded-md hover:bg-blue-600 transition-colors text-xl"
                >
                  发布
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold p-6 border-b text-center">社区动态</h2>
            {posts.length === 0 ? (
              <div className="p-10 text-center text-gray-500 text-xl">
                还没有动态，快来发布第一条吧！
              </div>
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
