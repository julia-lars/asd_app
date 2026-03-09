import React, { useState } from 'react';
import { auth, db } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const TEXT = {
  title: '\u6ce8\u518c',
  name: '\u59d3\u540d',
  email: '\u90ae\u7bb1',
  password: '\u5bc6\u7801',
  hasAccount: '\u5df2\u6709\u8d26\u53f7\uff1f',
  login: '\u767b\u5f55',
  register: '\u6ce8\u518c'
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'family',
        createdAt: new Date()
      });

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
            <label className="block text-gray-700 mb-2">{TEXT.name}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            {TEXT.register}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>{TEXT.hasAccount}<Link to="/login" className="text-blue-500 hover:underline">{TEXT.login}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
