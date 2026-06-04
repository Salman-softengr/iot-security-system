import React from 'react';
import { THREAT_EVENTS, MITRE_TECHNIQUES } from '../data/mockData';
import { ShieldAlert, AlertTriangle, Filter, Download, ExternalLink, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const ThreatCenter = () => {
  const THREAT_TYPES = [
    { name: 'Port Scan', count: 12 },
    { name: 'ARP Spoof', count: 5 },
    { name: 'Data Exfil', count: 3 },
    { name: 'DDoS', count: 2 },
    { name: 'Lateral', count: 4 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">Intelligence Control Center</h1>
          <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em]">Aggregated real-time analysis of network-wide threat vectors.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-white text-slate-600 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 hover:shadow-md transition-all">
           <Download size={16} /> Generate Intel Report
        </button>
      </header>

      {/* High Alert Banner */}
      <div className="bg-red-600 text-white p-8 rounded-[3rem] flex flex-col xl:flex-row items-center justify-between shadow-2xl shadow-red-600/20 gap-8 border-b-4 border-red-700">
         <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="p-5 bg-white/20 rounded-[2rem] border border-white/30 backdrop-blur-sm animate-pulse">
               <AlertTriangle size={40}/>
            </div>
            <div>
               <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2 italic">Critical Breach Protocol Active</h2>
               <p className="text-white/80 font-bold text-sm tracking-wide uppercase text-[11px]">Automatic mitigation engaged for 2 nodes in the current window • Unauthorized egress blocked</p>
            </div>
         </div>
         <div className="flex gap-4 w-full xl:w-auto">
            <button className="flex-1 px-8 py-4 bg-white text-red-600 font-black text-[10px] rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-lg active:scale-95">Review Incident Cluster</button>
            <button className="flex-1 px-8 py-4 bg-red-800 text-white font-black text-[10px] rounded-2xl uppercase tracking-[0.2em] border border-red-700 hover:bg-red-900 active:scale-95">Acknowledge</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Threat Table */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
             <h3 className="text-xl font-black text-slate-900 flex items-center gap-4 italic">
                <div className="p-2 bg-red-50 text-red-600 rounded-xl"><ShieldAlert size={20} /></div>
                Active Security Incidents
             </h3>
             <div className="flex items-center gap-3">
                <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all border border-slate-100"><Filter size={18}/></button>
                <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors">Select Cluster</button>
             </div>
          </div>
          <div className="flex-1 overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50">
                   <tr>
                      <th className="px-10 py-6">Operational Severity</th>
                      <th className="px-10 py-6">Target Identity</th>
                      <th className="px-10 py-6 text-center">Neural Score</th>
                      <th className="px-10 py-6 text-right">Detection Time</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-bold">
                   {THREAT_EVENTS.map((event) => (
                     <tr key={event.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                        <td className="px-10 py-7">
                           <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${event.severity === 'critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                              {event.severity}
                           </span>
                        </td>
                        <td className="px-10 py-7">
                           <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight italic">{event.deviceName}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{event.type}</span>
                           </div>
                        </td>
                        <td className="px-10 py-7">
                           <div className="flex flex-col items-center gap-2">
                              <span className="text-xs font-black text-slate-700">{(event.score * 100).toFixed(0)}%</span>
                              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                                 <div className="h-full bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]" style={{ width: `${event.score * 100}%` }}></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-7 text-right">
                           <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter italic">{event.detectedAt.split(' ')[0]}</p>
                           <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{event.detectedAt.split(' ')[1]}</p>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Breakdown Charts */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
              <h3 className="text-sm font-black text-slate-900 mb-10 uppercase tracking-[0.3em] border-l-4 border-blue-600 pl-4 leading-none italic">Threat Class Distribution</h3>
              <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={THREAT_TYPES} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                       <Tooltip cursor={{fill: 'rgba(37, 99, 235, 0.05)'}} />
                       <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} animationDuration={2000} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-10 uppercase tracking-[0.3em] border-l-4 border-purple-600 pl-4 leading-none italic flex items-center gap-3">
                 <Zap size={18} className="text-purple-600" />
                 MITRE Defensive Grid
              </h3>
              <div className="grid grid-cols-2 gap-5">
                 {MITRE_TECHNIQUES.map((tech) => (
                   <div key={tech.id} className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:border-blue-200 transition-all cursor-crosshair">
                      <span className="text-[9px] font-black text-blue-600 uppercase mb-2 tracking-widest group-hover:scale-110 transition-transform">{tech.id}</span>
                      <p className="text-[11px] font-bold text-slate-700 leading-tight mb-3 h-10 flex items-center uppercase tracking-tight">{tech.name}</p>
                      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg border shadow-sm ${tech.coverage === 'high' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                         {tech.coverage}
                      </span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:bg-blue-600 hover:shadow-blue-600/20 transition-all active:scale-95">
                 Audit TTP Coverage <ExternalLink size={14}/>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatCenter;
