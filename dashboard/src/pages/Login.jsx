import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const { data } = await client.post('/auth/token', formData);
      localStorage.setItem('token', data.access_token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <div className="w-full max-w-md p-8 bg-slate-900 rounded-lg shadow-2xl border border-cyan-500/20">
        <div className="flex justify-center mb-8">
          <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/30">
            <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">IoT Security Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-2">Username</label>
            <input
              type="text"
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-400 text-sm mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button className="w-full p-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition-colors">
            ACCESS SYSTEM
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
