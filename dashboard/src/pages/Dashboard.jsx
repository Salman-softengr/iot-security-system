import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  ShieldCheckIcon, ShieldExclamationIcon, CpuChipIcon, 
  SignalIcon, LockClosedIcon, BellIcon,
  ExclamationTriangleIcon, BoltIcon, FingerPrintIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [devRes, alertRes] = await Promise.all([
        client.get('/devices/'),
        client.get('/alerts/')
      ]);
      setDevices(devRes.data);
      setAlerts(alertRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { name: 'Managed Assets', value: devices.length, icon: CpuChipIcon, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { name: 'Critical Threats', value: alerts.filter(a => a.severity === 'CRITICAL').length, icon: ShieldExclamationIcon, color: 'text-red-400', bg: 'bg-red-500/10' },
    { name: 'Quarantined', value: devices.filter(d => d.vlan_tag === 999).length, icon: LockClosedIcon, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { name: 'AI Reliability', value: '99.98%', icon: FingerPrintIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const chartData = devices
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 10)
    .map(d => ({
      name: (d.hostname || d.device_id).split('-')[0],
      score: d.risk_score * 100,
    }));

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#020617]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="h-16 w-16 border-t-2 border-b-2 border-cyan-500 rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden">
      <Toaster position="top-right" toastOptions={{ style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}} />
      
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -100 }} animate={{ x: 0 }}
        className="fixed left-0 top-0 h-full w-20 bg-slate-900/80 backdrop-blur-2xl border-r border-slate-800 flex flex-col items-center py-8 space-y-8 z-50"
      >
        <ShieldCheckIcon className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
        <nav className="flex flex-col space-y-6">
          <SignalIcon className="p-3 text-cyan-400 bg-cyan-500/10 rounded-2xl cursor-pointer" />
          <CpuChipIcon className="p-3 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer" />
          <BellIcon className="p-3 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer" />
        </nav>
      </motion.div>

      <main className="ml-20 p-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-cyan-500 font-black uppercase tracking-[0.3em] text-xs mb-3">Neural Defense Grid</p>
            <h1 className="text-5xl font-black text-white">Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Overview</span></h1>
          </motion.div>
          
          <div className="flex gap-4">
            <div className="bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Core Status: Optimal</span>
            </div>
            <button onClick={() => { toast.success('Re-scanning network...'); fetchData(); }} className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 hover:bg-cyan-500/20 transition-all">
              <BoltIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 hover:border-cyan-500/40 group transition-all cursor-default"
            >
              <stat.icon className={`w-10 h-10 ${stat.color} mb-6 transition-transform group-hover:scale-110`} />
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">{stat.name}</h3>
              <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
              <div className={`absolute top-0 right-0 p-12 ${stat.bg} rounded-bl-full opacity-10 blur-2xl group-hover:opacity-20 transition-all`} />
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-800"
          >
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <SignalIcon className="w-8 h-8 text-cyan-400" />
                Network Intelligence Matrix
              </h3>
              <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700">
                <button className="px-4 py-1.5 text-xs font-bold text-white bg-slate-700 rounded-lg">Real-time</button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-white transition-colors">Historical</button>
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="cyberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} dy={15} />
                  <YAxis stroke="#475569" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip 
                    cursor={{ stroke: '#06b6d4', strokeWidth: 2 }}
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #06b6d4', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#06b6d4" 
                    strokeWidth={4} 
                    fill="url(#cyberGradient)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Forensic Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-800"
          >
            <h3 className="text-2xl font-black text-white mb-10">Threat Intelligence</h3>
            <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              <AnimatePresence>
                {alerts.slice(0, 10).map((alert, idx) => (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-red-500/30 transition-all group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${alert.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-200 group-hover:text-white mb-2 leading-snug">{alert.message}</p>
                    <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-tighter">Source: {alert.device_id}</p>
                    <div className="absolute inset-y-0 left-0 w-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button className="w-full mt-10 py-4 text-xs font-black text-cyan-400 hover:text-white transition-colors border border-cyan-500/20 hover:bg-cyan-500/10 rounded-2xl uppercase tracking-[0.2em]">
              Deep Forensic Analysis →
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
