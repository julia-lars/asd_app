import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Social from './pages/Social/Social';
import AiChat from './pages/AiChat/AiChat';
import Help from './pages/Help/Help';
import Profile from './pages/Profile/Profile';

const KnowledgeGraphPage = lazy(() => import('./pages/Help/KnowledgeGraphPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex h-[100dvh] items-center justify-center bg-slate-950 text-slate-300 text-xl">
              正在加载页面...
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/social" element={<Social />} />
            <Route path="/ai-chat" element={<AiChat />} />
            <Route path="/help" element={<Help />} />
            <Route path="/help/knowledge-graph" element={<KnowledgeGraphPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/ai-chat" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
