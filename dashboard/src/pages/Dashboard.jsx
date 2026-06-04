import React from 'react';
import MetricCard from '../components/MetricCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ANOMALY_HISTORY, THREAT_EVENTS } from '../data/mockData';
import { ALL_DEVICES } from '../data/devices';
import ScoreBar from '../components/ScoreBar';
import StatusBadge from '../components/StatusBadge';
import { Activity, ShieldAlert, Wifi, Zap, Database, Server, Terminal, Lock, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const riskyDevices = [...ALL_DEVICES].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">Operational Command Center</h1>
          <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em]">Neural Defense Grid • Active surveillance on {ALL_DEVICES.length} nodes</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">System Optimal</span>
           </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <MetricCard title="Total Assets" value={ALL_DEVICES.length} icon="Cpu" color="blue" trend={12} to="/devices" />
        <MetricCard title="Active Threats" value="3" icon="ShieldAlert" color="red" trend={-5} subtitle="Live Alert" to="/threats" />
        <MetricCard title="Quarantined" value="2" icon="Lock" color="purple" to="/threats" />
        <MetricCard title="Net Health" value="91%" icon="Wifi" color="green" trend={2} />
        <MetricCard title="Velocity" value="4.8k" icon="Zap" color="amber" subtitle="Packets/s" />
        <MetricCard title="Node Uptime" value="99.7%" icon="Activity" color="cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Threat Distribution Map */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Wifi size={20} /></div>
              Network Intelligence Mesh
            </h3>
            <div className="hidden sm:flex gap-3">
              <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span> Safe Zone
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span> Threat Vector
              </span>
            </div>
          </div>
          <div className="flex-1 min-h-[400px] flex items-center justify-center relative bg-slate-50/30 rounded-[2.5rem] border border-dashed border-slate-200 group overflow-hidden">
             <div className="relative w-full h-full p-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-600/5 border border-blue-600/20 rounded-full flex items-center justify-center z-10 backdrop-blur-sm">
                   <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40">
                      <Server size={32} />
                   </div>
                   <div className="absolute inset-0 rounded-full animate-[ping_3s_infinite] bg-blue-600 opacity-10"></div>
                </div>
                
                {[...Array(10)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="absolute"
                    style={{
                      top: `${50 + 38 * Math.sin(i * (Math.PI / 5))}%`,
                      left: `${50 + 38 * Math.cos(i * (Math.PI / 5))}%`,
                    }}
                  >
                    <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center bg-white shadow-xl transition-all hover:scale-125 hover:z-20 cursor-crosshair
                      ${i % 4 === 0 ? 'border-red-500 text-red-500 animate-pulse' : 'border-emerald-500 text-emerald-500 hover:border-blue-500 hover:text-blue-500'}
                    `}>
                      {i % 4 === 0 ? <ShieldAlert size={20} /> : <Cpu size={20} />}
                    </div>
                    {/* SVG Connector Line */}
                    <svg className="absolute top-1/2 left-1/2 -z-10 overflow-visible w-0 h-0">
                       <line x1="0" y1="0" x2={(-38 * Math.cos(i * (Math.PI / 5))) * 5} y2={(-38 * Math.sin(i * (Math.PI / 5))) * 5} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200" />
                    </svg>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 italic">
            <Terminal size={24} className="text-blue-600" />
            AI Trace Feed
          </h3>
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[450px] pr-4 custom-scrollbar">
            {THREAT_EVENTS.map((event) => (
              <Link to="/threats" key={event.id} className="flex gap-4 group cursor-pointer border-b border-slate-50 pb-5 last:border-none transition-all hover:translate-x-1">
                <div className={`mt-1 p-2.5 rounded-2xl border ${event.severity === 'critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  <ShieldAlert size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{event.type}</p>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{event.detectedAt.split(' ')[1]}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{event.deviceName}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/activity" className="mt-6 py-4 bg-slate-50 rounded-2xl text-center text-[10px] font-black text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-[0.2em]">View Full Forensic History</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Anomaly Chart */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">AI Reconstruction Error (24h)</h3>
             <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600"></span> Mean Score</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md border-2 border-slate-200 border-dashed"></span> Baseline</div>
             </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANOMALY_HISTORY}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" stroke="#cbd5e1" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#cbd5e1" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ color: '#2563eb', fontWeight: 'black', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={4} fill="url(#scoreColor)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Riskiest Devices */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-900 mb-10 uppercase tracking-tight">Highest Risk Vectors</h3>
          <div className="flex-1 space-y-8">
            {riskyDevices.map((dev) => (
              <div key={dev.id} className="group relative">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-col">
                    <Link to={`/devices/${dev.id}`} className="text-sm font-black text-slate-800 hover:text-blue-600 transition-colors group-hover:translate-x-1 transition-transform inline-block uppercase tracking-tight">{dev.name}</Link>
                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{dev.mac}</span>
                  </div>
                  <StatusBadge status={dev.status} />
                </div>
                <ScoreBar score={dev.score} />
              </div>
            ))}
          </div>
          <Link to="/devices" className="mt-10 py-4 border-2 border-slate-50 rounded-2xl text-center text-[10px] font-black text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all uppercase tracking-[0.2em]">Audit All Network Assets</Link>
        </div>
      </div>

      {/* System Health Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Message Broker', val: '12ms', icon: Database, color: 'blue', sub: 'Kafka Lag' },
          { label: 'Neural Latency', val: '187ms', icon: Zap, color: 'purple', sub: 'Inference' },
          { label: 'Ansible Sync', val: 'Active', icon: Activity, color: 'emerald', sub: 'Quarantine' },
          { label: 'Query Velocity', val: '340/s', icon: Server, color: 'amber', sub: 'SQL Throughput' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
             <div className={`p-3.5 bg-${item.color}-50 text-${item.color}-600 rounded-2xl border border-${item.color}-100`}>
                <item.icon size={22}/>
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.sub}</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">{item.val}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
