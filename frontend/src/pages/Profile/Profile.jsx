import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import BottomNav from '../../components/common/BottomNav';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-[60px] py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">孤独症支持平台</h1>
          <div className="flex items-center space-x-4">
            <span className="text-xl text-gray-700">欢迎, {user.email}</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-[60px] py-[80px]">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">个人中心</h2>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">个人信息</h3>
                <p className="text-lg text-gray-700">邮箱: {user.email}</p>
                <p className="text-lg text-gray-700">用户ID: {user.uid}</p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">账号设置</h3>
                <p className="text-lg text-gray-700">修改密码</p>
                <p className="text-lg text-gray-700">绑定手机</p>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition-colors text-xl"
                >
                  退出登录
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
