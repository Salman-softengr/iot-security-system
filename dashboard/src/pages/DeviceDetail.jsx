import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DEVICES } from '../data/devices';
import { THREAT_EVENTS, TRAFFIC_DATA } from '../data/mockData';
import DeviceAvatar from '../components/DeviceAvatar';
import StatusBadge from '../components/StatusBadge';
import { 
  ArrowLeft, Info, Activity, ShieldAlert, History, 
  MapPin, Factory, Cpu, Download, RefreshCcw, 
  AlertCircle, ShieldCheck, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { toast } from 'react-hot-toast';

const DeviceDetail = () => {
  const { id } = useParams();
  const device = DEVICES.find(d => d.id === parseInt(id)) || DEVICES[0];
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
    <div className="space-y-8 pb-20">
      {/* Top Banner for Quarantined */}
      {device.status === 'quarantined' && (
        <div className="bg-purple-600 text-white px-8 py-4 rounded-3xl flex items-center justify-between shadow-lg shadow-purple-600/20 animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-xl"><Lock size={24}/></div>
              <div>
                 <p className="text-lg font-black tracking-tight uppercase">Isolated Node</p>
                 <p className="text-sm font-medium text-white/80 tracking-wide">This device is currently restricted to VLAN 999. Local traffic only.</p>
              </div>
           </div>
           <button className="px-6 py-2 bg-white text-purple-600 font-black text-xs rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-widest">Restore Access</button>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        <Link to="/devices" className="absolute top-8 left-8 lg:static p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        
        <div className="relative">
           <DeviceAvatar name={device.name} status={device.status} size="lg" />
           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-lg text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Uptime: {device.uptime}
           </div>
        </div>

        <div className="flex-1 text-center lg:text-left">
           <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{device.name}</h1>
              <StatusBadge status={device.status} />
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manufacturer</p>
                 <p className="text-sm font-bold text-slate-700 flex items-center justify-center lg:justify-start gap-2"><Factory size={14}/> {device.manufacturer}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model</p>
                 <p className="text-sm font-bold text-slate-700">{device.model}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                 <p className="text-sm font-bold text-slate-700 flex items-center justify-center lg:justify-start gap-2"><MapPin size={14}/> {device.location}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Firmware</p>
                 <p className="text-sm font-bold text-slate-700 flex items-center justify-center lg:justify-start gap-2">
                    {device.firmware} 
                    <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded-md border border-green-100">LATEST</span>
                 </p>
              </div>
           </div>

           <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button 
                onClick={handleScan}
                disabled={isScanning}
                className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center gap-3 transition-all
                ${isScanning ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95'}`}
              >
                {isScanning ? <RefreshCcw size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                {isScanning ? 'Executing Scan...' : 'Run AI Scan'}
              </button>
              <button 
                disabled={device.status === 'quarantined'}
                className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center gap-3 transition-all border
                ${device.status === 'quarantined' ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-white text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 active:scale-95'}`}
              >
                <ShieldAlert size={16} />
                Isolate Node
              </button>
              <button className="px-6 py-3 bg-white text-green-600 border border-green-100 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center gap-3 hover:bg-green-50 transition-all active:scale-95">
                <ShieldCheck size={16} />
                Mark Verified
              </button>
           </div>
        </div>

        <div className="w-full lg:w-48 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-50 pt-8 lg:pt-0 lg:pl-12">
            <div className="relative w-32 h-32 mb-4">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - device.score)}
                    className={`${device.score > 0.7 ? 'text-red-500' : 'text-blue-600'} transition-all duration-1000 ease-out`} 
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">{(100 - device.score * 100).toFixed(0)}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Health</span>
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Safety Rating</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-50 px-8">
           {[
             { id: 'overview', name: 'Overview', icon: Info },
             { id: 'traffic', name: 'Traffic Analysis', icon: Activity },
             { id: 'threats', name: 'Threat Forensic', icon: ShieldAlert },
             { id: 'history', name: 'Audit Log', icon: History }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-3 px-8 py-6 text-sm font-black transition-all relative
               ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
               <tab.icon size={18} />
               {tab.name}
               {activeTab === tab.id && (
                 <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
               )}
             </button>
           ))}
        </div>

        <div className="p-10">
           {activeTab === 'overview' && (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-300">
                <div className="lg:col-span-4 space-y-8">
                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4 leading-none">Core Telemetry</h3>
                   <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: 'IP Address', value: device.ip },
                        { label: 'MAC Address', value: device.mac },
                        { label: 'Subnet Mask', value: '255.255.255.0' },
                        { label: 'VLAN Assignment', value: device.vlan },
                        { label: 'First Discovered', value: device.firstSeen },
                        { label: 'Last Telemetry', value: device.lastSeen },
                      ].map((item) => (
                        <div key={item.label}>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                           <p className="text-sm font-bold text-slate-700 font-mono">{item.value}</p>
                        </div>
                      ))}
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Protocol Stack</p>
                      <div className="flex flex-wrap gap-2">
                         {device.protocols.map(p => (
                           <span key={p} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-black border border-slate-100">{p}</span>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Zap size={16} className="text-blue-600" />
                        Live Resource Consumption
                      </h4>
                      <div className="space-y-6">
                         {[
                           { label: 'CPU LOAD', value: device.cpu, color: 'bg-blue-600' },
                           { label: 'MEMORY LOAD', value: device.mem, color: 'bg-purple-600' }
                         ].map(res => (
                           <div key={res.label}>
                              <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase">
                                 <span>{res.label}</span>
                                 <span>{res.value}%</span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                 <motion.div initial={{ width: 0 }} animate={{ width: `${res.value}%` }} className={`h-full ${res.color}`} />
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                      <Download size={48} className="text-blue-600 mb-4 opacity-20" />
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Firmware Audit</h4>
                      <p className="text-xs font-bold text-slate-500 mb-4">Version {device.firmware} is secure.</p>
                      <button className="px-6 py-2 bg-white text-blue-600 border border-blue-100 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm">Check for Updates</button>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'traffic' && (
             <div className="space-y-12 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="h-64">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Outbound Traffic (24h)</p>
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={TRAFFIC_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="bytesOut" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="h-64 flex flex-col items-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 w-full">Protocol Distribution</p>
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={PROTOCOL_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                               {PROTOCOL_DATA.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                
                <div className="bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden">
                   <div className="p-6 border-b border-slate-100 bg-white">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Peak Hours</h4>
                   </div>
                   <div className="p-8 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={TRAFFIC_DATA}>
                            <Bar dataKey="packetsIn" fill="#2563eb" radius={[4, 4, 0, 0]} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'threats' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                 <div className="flex items-center gap-4 p-6 bg-amber-50 border border-amber-100 rounded-[2rem]">
                    <AlertCircle className="text-amber-600" size={24} />
                    <p className="text-sm font-bold text-amber-900 leading-tight">Historical observation of elevated DNS traffic from this node on 2024-03-12. No active quarantine required.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {THREAT_EVENTS.filter(e => e.deviceId === device.id).map(e => (
                       <div key={e.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group">
                          <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
                             <ShieldAlert size={64}/>
                          </div>
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black text-white uppercase tracking-widest ${e.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}>
                             {e.severity}
                          </span>
                          <h4 className="text-lg font-black text-slate-900 mt-3 mb-1 uppercase tracking-tight">{e.type}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-4">{e.detectedAt}</p>
                          <p className="text-xs font-bold text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">"{e.action}"</p>
                          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">View Forensic Trace →</button>
                       </div>
                    ))}
                    {THREAT_EVENTS.filter(e => e.deviceId === device.id).length === 0 && (
                       <div className="md:col-span-3 text-center py-12">
                          <ShieldCheck className="mx-auto text-green-500 opacity-20 mb-4" size={48} />
                          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No historical threat detections for this node.</p>
                       </div>
                    )}
                 </div>
              </div>
           )}

           {activeTab === 'history' && (
              <div className="bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden animate-in fade-in duration-300">
                 <table className="w-full text-left">
                    <thead className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <tr>
                          <th className="px-8 py-6">Timestamp</th>
                          <th className="px-8 py-6">Action</th>
                          <th className="px-8 py-6">Actor</th>
                          <th className="px-8 py-6">Outcome</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {[
                         { time: '2024-03-15 14:32:11', act: 'System Scan Executed', src: 'AI ENGINE', res: 'SUCCESS' },
                         { time: '2024-03-15 11:20:05', act: 'Manual Metadata Update', src: 'Admin (SA)', res: 'SUCCESS' },
                         { time: '2024-03-14 09:12:44', act: 'Flow Volume Threshold Reset', src: 'SYSTEM', res: 'SUCCESS' },
                       ].map((log, i) => (
                         <tr key={i} className="text-sm font-bold text-slate-700 hover:bg-white transition-colors group">
                            <td className="px-8 py-6 font-mono text-xs">{log.time}</td>
                            <td className="px-8 py-6">{log.act}</td>
                            <td className="px-8 py-6 uppercase text-[11px] tracking-tighter text-slate-500 font-black">{log.src}</td>
                            <td className="px-8 py-6"><span className="text-green-500 font-black text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-100">{log.res}</span></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 <div className="p-8 bg-white border-t border-slate-50 flex justify-center">
                    <button className="flex items-center gap-3 text-xs font-black text-slate-400 hover:text-blue-600 transition-all uppercase tracking-widest">
                       <Download size={16} /> Export Forensic Log (.CSV)
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
