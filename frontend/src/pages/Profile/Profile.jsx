import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import BottomNav from '../../components/common/BottomNav';

const TEXT = {
  loading: '\u52a0\u8f7d\u4e2d...',
  appTitle: '\u5b64\u72ec\u75c7\u652f\u6301\u5e73\u53f0',
  welcome: '\u6b22\u8fce',
  title: '\u4e2a\u4eba\u4e2d\u5fc3',
  profile: '\u4e2a\u4eba\u4fe1\u606f',
  email: '\u90ae\u7bb1',
  uid: '\u7528\u6237ID',
  settings: '\u8d26\u53f7\u8bbe\u7f6e',
  resetPwd: '\u4fee\u6539\u5bc6\u7801',
  bindPhone: '\u7ed1\u5b9a\u624b\u673a',
  logout: '\u9000\u51fa\u767b\u5f55'
};

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-2xl">{TEXT.loading}</div>;
  }

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
        <div className="max-w-full px-[80px] py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">{TEXT.appTitle}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-xl text-gray-700">{TEXT.welcome}, {user.email}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-full px-[80px] py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">{TEXT.title}</h2>

            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">{TEXT.profile}</h3>
                <p className="text-lg text-gray-700">{TEXT.email}: {user.email}</p>
                <p className="text-lg text-gray-700">{TEXT.uid}: {user.uid}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">{TEXT.settings}</h3>
                <p className="text-lg text-gray-700">{TEXT.resetPwd}</p>
                <p className="text-lg text-gray-700">{TEXT.bindPhone}</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition-colors text-xl"
                >
                  {TEXT.logout}
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
