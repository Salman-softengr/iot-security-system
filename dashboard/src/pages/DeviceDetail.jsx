import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_DEVICES } from '../data/devices';
import { THREAT_EVENTS, TRAFFIC_DATA } from '../data/mockData';
import DeviceAvatar from '../components/DeviceAvatar';
import StatusBadge from '../components/StatusBadge';
import { 
  ArrowLeft, Info, Activity, ShieldAlert, History, 
  MapPin, Factory, Cpu, Download, RefreshCcw, 
  AlertCircle, ShieldCheck, Zap, Lock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const DeviceDetail = () => {
  const { id } = useParams();
  const device = ALL_DEVICES.find(d => d.id === parseInt(id)) || ALL_DEVICES[0];
  const [activeTab, setActiveTab] = useState('overview');
  const [isScanning, setIsScanning] = useState(false);

  const COLORS = ['#2563eb', '#8b5cf6', '#f59e0b', '#ef4444'];
  const PROTOCOL_DATA = [
    { name: 'TCP', value: 67 },
    { name: 'UDP', value: 21 },
    { name: 'ARP', value: 8 },
    { name: 'ICMP', value: 4 },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      toast.success('AI Deep Scan complete — No new threat vectors detected.', {
        icon: <ShieldCheck className="text-green-500" />,
        duration: 4000
      });
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Top Banner for Quarantined */}
      {device.status === 'quarantined' && (
        <div className="bg-purple-600 text-white px-8 py-4 rounded-[2rem] flex flex-col md:flex-row items-center justify-between shadow-xl shadow-purple-600/20 gap-4">
           <div className="flex items-center gap-4 text-center md:text-left">
              <div className="p-3 bg-white/20 rounded-2xl"><Lock size={24}/></div>
              <div>
                 <p className="text-lg font-black tracking-tight uppercase italic">Restricted Operational Mode</p>
                 <p className="text-sm font-bold text-white/80 tracking-wide uppercase text-[11px]">VLAN 999 Isolation Active • Unauthorized communication blocked</p>
              </div>
           </div>
           <button className="px-8 py-3 bg-white text-purple-600 font-black text-xs rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-[0.2em] shadow-lg shadow-black/10">Restore Network Access</button>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-12 items-center lg:items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 -z-10" />
        
        <Link to="/devices" className="absolute top-8 left-8 lg:static p-3.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all group">
          <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        
        <div className="relative group">
           <DeviceAvatar name={device.name} status={device.status} size="lg" imageUrl={device.image} />
           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-5 py-2 rounded-full border border-slate-100 shadow-xl text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
              UPTIME: {device.uptime}
           </div>
        </div>

        <div className="flex-1 text-center lg:text-left">
           <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">{device.name}</h1>
              <StatusBadge status={device.status} />
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10 mb-10">
              {[
                { label: 'Manufacturer', val: device.manufacturer, icon: Factory },
                { label: 'Asset Model', val: device.model, icon: Cpu },
                { label: 'Physical Zone', val: device.location, icon: MapPin },
                { label: 'Revision', val: device.firmware, icon: ShieldCheck, sub: 'LATEST' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                   <p className="text-sm font-bold text-slate-700 flex items-center justify-center lg:justify-start gap-2">
                     <item.icon size={14} className="text-blue-500 opacity-60"/> {item.val}
                     {item.sub && <span className="text-[8px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded font-black border border-green-100">{item.sub}</span>}
                   </p>
                </div>
              ))}
           </div>

           <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button 
                onClick={handleScan}
                disabled={isScanning}
                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all
                ${isScanning ? 'bg-slate-100 text-slate-400 shadow-inner' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95'}`}
              >
                {isScanning ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} />}
                {isScanning ? 'Synchronizing Trace...' : 'Initiate AI Audit'}
              </button>
              <button 
                disabled={device.status === 'quarantined'}
                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all border
                ${device.status === 'quarantined' ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-white text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 active:scale-95 shadow-sm'}`}
              >
                <ShieldAlert size={16} />
                Quarantine
              </button>
           </div>
        </div>

        <div className="w-full lg:w-64 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-50 pt-10 lg:pt-0 lg:pl-16">
            <div className="relative w-36 h-32 mb-4">
               <svg className="w-full h-full transform -rotate-90 scale-x-[-1]">
                  <circle cx="72" cy="64" r="54" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-50" />
                  <motion.circle cx="72" cy="64" r="54" stroke="currentColor" strokeWidth="10" fill="transparent" 
                    strokeDasharray={339.3} 
                    initial={{ strokeDashoffset: 339.3 }}
                    animate={{ strokeDashoffset: 339.3 * (device.score) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`${device.score > 0.7 ? 'text-red-500' : 'text-blue-600'}`} 
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">{(100 - device.score * 100).toFixed(0)}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Health</span>
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">Operational Integrity</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="flex border-b border-slate-50 px-10 overflow-x-auto no-scrollbar">
           {[
             { id: 'overview', name: 'Identity & Resource', icon: Info },
             { id: 'traffic', name: 'Telemetry Analysis', icon: Activity },
             { id: 'threats', name: 'Threat Intelligence', icon: ShieldAlert },
             { id: 'history', name: 'Operational Log', icon: History }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-3 px-8 py-7 text-xs font-black transition-all relative whitespace-nowrap uppercase tracking-widest
               ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
               <tab.icon size={16} />
               {tab.name}
               {activeTab === tab.id && (
                 <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
               )}
             </button>
           ))}
        </div>

        <div className="p-10 md:p-14">
           {activeTab === 'overview' && (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-5 space-y-10">
                   <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-blue-600 pl-4 leading-none italic">Asset Metadata</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                         {[
                           { label: 'Assigned IP', val: device.ip },
                           { label: 'MAC Signature', val: device.mac },
                           { label: 'Segment Subnet', val: '255.255.255.0' },
                           { label: 'VLAN Tag', val: device.vlan },
                           { label: 'Network Origin', val: device.firstSeen },
                           { label: 'Telemetry TTL', val: device.lastSeen },
                         ].map((item) => (
                           <div key={item.label} className="group">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-blue-500 transition-colors">{item.label}</p>
                              <p className="text-sm font-bold text-slate-700 font-mono tracking-tight">{item.val}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Supported Stack</p>
                      <div className="flex flex-wrap gap-2.5">
                         {device.protocols.map(p => (
                           <span key={p} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black border border-slate-100 uppercase tracking-widest group cursor-default hover:bg-white hover:border-blue-200 transition-all">{p}</span>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center shadow-inner">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20"><Zap size={18} /></div>
                         <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic">Compute Load</h4>
                      </div>
                      <div className="space-y-8">
                         {[
                           { label: 'CPU Performance', value: device.cpu, color: 'bg-blue-600' },
                           { label: 'Memory Allocation', value: device.mem, color: 'bg-purple-600' }
                         ].map(res => (
                           <div key={res.label}>
                              <div className="flex justify-between text-[9px] font-black text-slate-500 mb-2.5 uppercase tracking-widest">
                                 <span>{res.label}</span>
                                 <span className="text-slate-900">{res.value}%</span>
                              </div>
                              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                                 <motion.div initial={{ width: 0 }} animate={{ width: `${res.value}%` }} transition={{duration: 1}} className={`h-full rounded-full ${res.color}`} />
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm relative group cursor-pointer overflow-hidden hover:border-blue-200 transition-all">
                      <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                      <Download size={56} className="text-blue-600 mb-5 opacity-20 group-hover:opacity-40 transition-all group-hover:scale-110" />
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Firmware Manifest</h4>
                      <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest">Build {device.firmware} Verified</p>
                      <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95">Audit Version</button>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'traffic' && (
             <div className="space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                   <div className="h-[300px]">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                         Ingress / Egress Velocity (24h)
                      </h4>
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={TRAFFIC_DATA}>
                            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="time" stroke="#cbd5e1" fontSize={9} fontWeight="black" axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="bytesOut" stroke="#2563eb" strokeWidth={3} fill="#2563eb" fillOpacity={0.05} animationDuration={2000} />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="h-[300px] flex flex-col items-center">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 w-full text-center lg:text-left flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                         Multiplex Protocol Stack
                      </h4>
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={PROTOCOL_DATA} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                               {PROTOCOL_DATA.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                               ))}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                
                <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-inner">
                   <div className="p-8 border-b border-slate-100 bg-white flex justify-between items-center">
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] italic">Operational Peaks (Packets Analyzed)</h4>
                      <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 uppercase">Mean Target: 140/s</span>
                   </div>
                   <div className="p-10 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={TRAFFIC_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <Tooltip cursor={{fill: 'rgba(37, 99, 235, 0.05)'}} />
                            <Bar dataKey="packetsIn" fill="#2563eb" radius={[6, 6, 0, 0]} animationDuration={1500} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'threats' && (
              <div className="space-y-10">
                 <div className="flex items-center gap-6 p-8 bg-amber-50/50 border border-amber-100 rounded-[2.5rem] shadow-sm">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><AlertCircle size={28} /></div>
                    <div>
                       <p className="text-sm font-black text-amber-900 uppercase tracking-tight italic mb-1">Active Monitoring Status</p>
                       <p className="text-xs font-bold text-amber-700/80 leading-relaxed uppercase tracking-wider">Historical observation of elevated DNS traffic from this node on 2024-03-12. Current AI confidence at 98.4%. No active quarantine required.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                    {THREAT_EVENTS.filter(e => e.deviceId === device.id).map(e => (
                       <div key={e.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-xl hover:shadow-red-600/5 transition-all">
                          <div className={`absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
                             <ShieldAlert size={80}/>
                          </div>
                          <span className={`px-3 py-1 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] ${e.severity === 'critical' ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-orange-500 shadow-lg shadow-orange-500/20'}`}>
                             {e.severity}
                          </span>
                          <h4 className="text-xl font-black text-slate-900 mt-6 mb-1 uppercase tracking-tight italic">{e.type}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">{e.detectedAt}</p>
                          <div className="space-y-4 mb-8">
                             <p className="text-xs font-bold text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 italic leading-relaxed">"{e.action}"</p>
                          </div>
                          <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:text-blue-700 transition-colors flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                             Execute Deep Packet Analysis <RefreshCcw size={12}/>
                          </button>
                       </div>
                    ))}
                    {THREAT_EVENTS.filter(e => e.deviceId === device.id).length === 0 && (
                       <div className="md:col-span-3 text-center py-20 bg-slate-50/50 rounded-[3rem] border border-slate-100 border-dashed">
                          <ShieldCheck className="mx-auto text-emerald-500 opacity-20 mb-6" size={64} />
                          <h3 className="text-lg font-black text-slate-900 uppercase italic mb-2 tracking-tight">Zero Threat Vectors Identified</h3>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Continuous AI auditing has not flagged this node for malicious signatures.</p>
                       </div>
                    )}
                 </div>
              </div>
           )}

           {activeTab === 'history' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                 <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] italic">Forensic Audit Stream</h4>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Retention: 365 Days</span>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-white text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                          <tr>
                             <th className="px-10 py-6">UTC Timestamp</th>
                             <th className="px-10 py-6">Event Action</th>
                             <th className="px-10 py-6">Origin Actor</th>
                             <th className="px-10 py-6 text-right">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {[
                            { time: '2024-03-15 14:32:11', act: 'Neural Baseline Re-synchronized', src: 'AI KERNEL', res: 'OPTIMAL' },
                            { time: '2024-03-15 11:20:05', act: 'Physical Port Configuration Update', src: 'ADMIN (SA)', res: 'SUCCESS' },
                            { time: '2024-03-14 09:12:44', act: 'Encrypted Flow Volume Reset', src: 'SYSTEM', res: 'SUCCESS' },
                            { time: '2024-03-13 18:45:30', act: 'Device Discovery Protocol Initiated', src: 'EDGE_COLL', res: 'SUCCESS' },
                          ].map((log, i) => (
                            <tr key={i} className="text-xs font-bold text-slate-700 hover:bg-slate-50/50 transition-colors group cursor-default">
                               <td className="px-10 py-6 font-mono text-[11px] text-slate-400">{log.time}</td>
                               <td className="px-10 py-6 text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{log.act}</td>
                               <td className="px-10 py-6 uppercase text-[10px] tracking-widest text-slate-500 font-black">{log.src}</td>
                               <td className="px-10 py-6 text-right"><span className="text-emerald-500 font-black text-[9px] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 uppercase tracking-widest">{log.res}</span></td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="p-10 bg-slate-50/30 border-t border-slate-50 flex justify-center">
                    <button className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-all uppercase tracking-[0.2em]">
                       <Download size={16} /> Download Encrypted Forensic Archive (.EFA)
                    </button>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
