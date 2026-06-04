import React from 'react';
import MetricCard from '../components/MetricCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { TRAFFIC_DATA, ANOMALY_HISTORY, THREAT_EVENTS } from '../data/mockData';
import { DEVICES } from '../data/devices';
import ScoreBar from '../components/ScoreBar';
import StatusBadge from '../components/StatusBadge';
import { Activity, ShieldAlert, Wifi, Zap, Database, Server, Terminal, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const riskyDevices = [...DEVICES].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Network Security Hub</h1>
        <p className="text-slate-500 font-medium">Global AI-driven surveillance active across 24 connected nodes.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <MetricCard title="Total Devices" value="24" icon="Cpu" color="blue" trend={12} />
        <MetricCard title="Active Threats" value="3" icon="ShieldAlert" color="red" trend={-5} subtitle="Blinking dot" />
        <MetricCard title="Quarantined" value="2" icon="Lock" color="purple" trend={0} />
        <MetricCard title="Network Health" value="91%" icon="Wifi" color="green" trend={2} />
        <MetricCard title="Packets/sec" value="4,847" icon="Zap" color="amber" trend={18} />
        <MetricCard title="Uptime" value="99.7%" icon="Activity" color="cyan" trend={0.1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Threat Distribution Map (Simplified logic) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Wifi size={24} className="text-blue-600" />
              Live Network Topology
            </h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> SAFE
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> THREAT
              </span>
            </div>
          </div>
          <div className="h-[400px] flex items-center justify-center relative bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
             {/* Styled Network Diagram Simulation */}
             <div className="relative w-full h-full p-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-600/10 border-2 border-blue-600 rounded-full flex items-center justify-center z-10">
                   <Server className="text-blue-600" size={32} />
                   <div className="absolute inset-0 rounded-full animate-ping bg-blue-600 opacity-20"></div>
                </div>
                {/* Simulated Nodes */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute transition-all duration-1000"
                    style={{
                      top: `${50 + 35 * Math.sin(i * (Math.PI / 6))}%`,
                      left: `${50 + 35 * Math.cos(i * (Math.PI / 6))}%`,
                    }}
                  >
                    <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center bg-white shadow-sm ${i % 4 === 0 ? 'border-red-500 text-red-500 animate-pulse' : 'border-green-500 text-green-500'}`}>
                      <Activity size={18} />
                    </div>
                  </div>
                ))}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
             </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <Terminal size={24} className="text-blue-600" />
            Live Intelligence
          </h3>
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
            {THREAT_EVENTS.map((event) => (
              <div key={event.id} className="flex gap-4 group cursor-pointer border-b border-slate-50 pb-4 last:border-none">
                <div className={`mt-1 p-2 rounded-lg ${event.severity === 'critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{event.type}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{event.deviceName} • {event.detectedAt.split(' ')[1]}</p>
                </div>
              </div>
            ))}
            <div className="pt-4 text-center">
              <button className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">Load Historic Logs</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Anomaly Chart */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8">AI Anomaly Baseline (24h)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANOMALY_HISTORY}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Riskiest Devices */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8">Asset Risk Profiling</h3>
          <div className="space-y-6">
            {riskyDevices.map((dev) => (
              <div key={dev.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Link to={`/devices/${dev.id}`} className="text-sm font-black text-slate-900 hover:text-blue-600 transition-colors">{dev.name}</Link>
                  <StatusBadge status={dev.status} />
                </div>
                <div className="flex items-center gap-3">
                  <ScoreBar score={dev.score} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Database size={20}/></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Kafka Message Lag</p>
              <p className="text-lg font-black text-slate-900">12ms</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
           <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Activity size={20}/></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Inference Latency</p>
              <p className="text-lg font-black text-slate-900">187ms</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Zap size={20}/></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Ansible Execution</p>
              <p className="text-lg font-black text-slate-900">2s ago</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
           <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Database size={20}/></div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">DB Queries/sec</p>
              <p className="text-lg font-black text-slate-900">340</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
