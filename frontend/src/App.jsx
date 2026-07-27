import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './i18n';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Welcome from './pages/Auth/Welcome';
import Social from './pages/Social/Social';
import AiChat from './pages/AiChat/AiChat';
import Help from './pages/Help/Help';
import GroupCounseling from './pages/Help/GroupCounseling';
import ExpertConsultation from './pages/Help/ExpertConsultation';
import Profile from './pages/Profile/Profile';
import UpgradeSuccess from './components/upgrade/UpgradeSuccess';

const KnowledgeGraphPage = lazy(() => import('./pages/Help/KnowledgeGraphPage'));

const PageFallback = () => {
  const { t } = useLanguage();
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-slate-950 text-slate-300 text-xl">
      {t('common.loadingPage')}
    </div>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/social" element={<Social />} />
              <Route path="/ai-chat" element={<AiChat />} />
              <Route path="/help" element={<Help />} />
              <Route path="/help/knowledge-graph" element={<KnowledgeGraphPage />} />
              <Route path="/help/group-counseling" element={<GroupCounseling />} />
              <Route path="/help/expert-consultation" element={<ExpertConsultation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/upgrade/success" element={<UpgradeSuccess />} />
              <Route path="/" element={<Navigate to="/welcome" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
