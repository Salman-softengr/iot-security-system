import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { ShieldCheckIcon, LockClosedIcon, UserIcon, KeyIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const { data } = await client.post('/auth/token', formData);
      localStorage.setItem('token', data.access_token);
      navigate('/');
    } catch (err) {
      setError('AUTHENTICATION_FAILED: Invalid Access Credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative p-10 bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <ShieldCheckIcon className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">System Access</h2>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.3em] mt-2">IoT Security Protocol</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Identity</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Operator ID"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Access Key</label>
              <div className="relative">
                <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-mono text-red-500 uppercase tracking-tighter text-center">
                {error}
              </div>
            )}

            <button 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-cyan-500/40 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'ESTABLISHING SECURE LINK...' : 'AUTHORIZE ACCESS'}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Level 4 Encryption Enabled
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
