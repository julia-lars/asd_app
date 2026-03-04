import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Social from './pages/Social/Social';
import AiChat from './pages/AiChat/AiChat';
import Help from './pages/Help/Help';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/social" element={<Social />} />
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Navigate to="/social" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
