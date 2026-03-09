import React, { useState } from 'react';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const TEXT = {
  title: '\u767b\u5f55',
  email: '\u90ae\u7bb1',
  password: '\u5bc6\u7801',
  noAccount: '\u8fd8\u6ca1\u6709\u8d26\u53f7\uff1f',
  register: '\u6ce8\u518c',
  login: '\u767b\u5f55'
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/ai-chat');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/background.png)' }}>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">{TEXT.title}</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">{TEXT.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">{TEXT.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            {TEXT.login}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>{TEXT.noAccount} <Link to="/register" className="text-blue-500 hover:underline">{TEXT.register}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
