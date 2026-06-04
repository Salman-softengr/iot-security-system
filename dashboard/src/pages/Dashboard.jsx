import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  ShieldCheckIcon, ShieldExclamationIcon, CpuChipIcon, 
  SignalIcon, LockClosedIcon, BellIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { name: 'Active Devices', value: devices.length, icon: CpuChipIcon, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { name: 'Threats Detected', value: alerts.length, icon: ShieldExclamationIcon, color: 'text-red-400', bg: 'bg-red-500/10' },
    { name: 'Network Isolation', value: devices.filter(d => d.vlan_tag === 999).length, icon: LockClosedIcon, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { name: 'System Integrity', value: '99.9%', icon: ShieldCheckIcon, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  const chartData = devices.map(d => ({
    name: d.hostname || d.device_id,
    score: d.risk_score * 100,
  })).sort((a, b) => b.score - a.score);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Sidebar / Nav */}
      <div className="fixed left-0 top-0 h-full w-20 bg-slate-900/50 border-r border-slate-800 flex flex-col items-center py-8 space-y-8 z-50">
        <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <ShieldCheckIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <nav className="flex flex-col space-y-6">
          <Link to="/" title="Dashboard" className="p-3 text-cyan-400 bg-cyan-500/10 rounded-xl border border-cyan-500/20"><SignalIcon className="w-6 h-6" /></Link>
          <Link to="/devices" title="Devices" className="p-3 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-all rounded-xl"><CpuChipIcon className="w-6 h-6" /></Link>
          <Link to="/alerts" title="Alerts" className="p-3 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-all rounded-xl relative">
            <BellIcon className="w-6 h-6" />
            {alerts.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
          </Link>
        </nav>
      </div>

      <main className="ml-20 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-cyan-500 uppercase mb-2">System Overview</h2>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">AI Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Command Center</span></h1>
          </div>
          <div className="flex items-center space-x-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-tighter">Live Monitor: Active</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.name} className="relative group overflow-hidden bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-500">
              <div className={`absolute top-0 right-0 p-8 ${stat.bg} rounded-bl-full translate-x-4 -translate-y-4 opacity-20 group-hover:scale-110 transition-transform`}></div>
              <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.name}</h3>
              <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <SignalIcon className="w-5 h-5 text-cyan-400" />
                Network Threat Distribution
              </h3>
              <select className="bg-slate-800 border-none text-xs rounded-lg px-3 py-1 focus:ring-1 focus:ring-cyan-500 text-slate-300">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Rankings */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-8">High Risk Devices</h3>
            <div className="flex-1 space-y-6">
              {devices.sort((a, b) => b.risk_score - a.risk_score).slice(0, 4).map((device) => (
                <div key={device.device_id} className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-200">{device.hostname || device.device_id}</span>
                    <span className={`text-xs font-bold ${device.risk_score > 0.7 ? 'text-red-400' : 'text-cyan-400'}`}>
                      {(device.risk_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${device.risk_score > 0.7 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
                      style={{ width: `${device.risk_score * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/devices" className="mt-8 text-center text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest">
              View All Assets →
            </Link>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-800 overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-red-500" />
              Real-time Forensic Feed
            </h3>
            <Link to="/alerts" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">View History</Link>
          </div>
          <div className="divide-y divide-slate-800">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="p-6 flex items-start gap-4 hover:bg-slate-800/30 transition-colors group">
                <div className={`mt-1 p-2 rounded-lg ${alert.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  <ShieldExclamationIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{alert.message}</h4>
                    <span className="text-[10px] font-mono text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-tighter">Source: <span className="text-cyan-500">{alert.device_id}</span> • Action: <span className="text-slate-400 italic">Analysis Logged</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
