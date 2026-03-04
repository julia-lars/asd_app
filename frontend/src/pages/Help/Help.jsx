import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';

const Help = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

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
            <h2 className="text-2xl font-semibold mb-6 text-center">帮助中心</h2>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">常见问题</h3>
                <p className="text-lg text-gray-700">这里提供孤独症相关的常见问题解答，帮助您更好地了解孤独症。</p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">资源链接</h3>
                <p className="text-lg text-gray-700">提供专业的孤独症相关资源和支持机构的链接。</p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">联系我们</h3>
                <p className="text-lg text-gray-700">如果您有任何问题或建议，欢迎联系我们。</p>
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
