import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';

const TEXT = {
  loading: '\u52a0\u8f7d\u4e2d...',
  appTitle: '\u5b64\u72ec\u75c7\u652f\u6301\u5e73\u53f0',
  welcome: '\u6b22\u8fce',
  title: '\u5e2e\u52a9\u4e2d\u5fc3',
  faq: '\u5e38\u89c1\u95ee\u9898',
  faqText: '\u8fd9\u91cc\u63d0\u4f9b\u5b64\u72ec\u75c7\u76f8\u5173\u7684\u5e38\u89c1\u95ee\u9898\u89e3\u7b54\uff0c\u5e2e\u52a9\u60a8\u66f4\u597d\u5730\u4e86\u89e3\u5b64\u72ec\u75c7\u3002',
  resources: '\u8d44\u6e90\u94fe\u63a5',
  resourcesText: '\u63d0\u4f9b\u4e13\u4e1a\u7684\u5b64\u72ec\u75c7\u76f8\u5173\u8d44\u6e90\u548c\u652f\u6301\u673a\u6784\u94fe\u63a5\u3002',
  contact: '\u8054\u7cfb\u6211\u4eec',
  contactText: '\u5982\u679c\u60a8\u6709\u4efb\u4f55\u95ee\u9898\u6216\u5efa\u8bae\uff0c\u6b22\u8fce\u8054\u7cfb\u6211\u4eec\u3002'
};

const Help = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-2xl">{TEXT.loading}</div>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

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
                <h3 className="text-xl font-semibold mb-2">{TEXT.faq}</h3>
                <p className="text-lg text-gray-700">{TEXT.faqText}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">{TEXT.resources}</h3>
                <p className="text-lg text-gray-700">{TEXT.resourcesText}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">{TEXT.contact}</h3>
                <p className="text-lg text-gray-700">{TEXT.contactText}</p>
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
