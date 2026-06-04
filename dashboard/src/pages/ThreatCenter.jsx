import React from 'react';
import { THREAT_EVENTS, TRAFFIC_DATA, MITRE_TECHNIQUES } from '../data/mockData';
import { ShieldAlert, AlertTriangle, Filter, Download, ExternalLink, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import StatusBadge from '../components/StatusBadge';

const ThreatCenter = () => {
  const THREAT_TYPES = [
    { name: 'Port Scan', count: 12 },
    { name: 'ARP Spoof', count: 5 },
    { name: 'Data Exfil', count: 3 },
    { name: 'DDoS', count: 2 },
    { name: 'Lateral', count: 4 },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Threat Intelligence Center</h1>
          <p className="text-slate-500 font-medium">Aggregated real-time analysis of network-wide threat vectors.</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-3 bg-white text-slate-600 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
           <Download size={16} /> Export Intel Report
        </button>
      </header>

      {/* High Alert Banner */}
      <div className="bg-red-600 text-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-xl shadow-red-600/20 animate-pulse">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-2xl border border-white/30"><AlertTriangle size={32}/></div>
            <div>
               <h2 className="text-2xl font-black uppercase tracking-tight leading-none mb-1">Critical Breach Attempt</h2>
               <p className="text-white/80 font-bold text-sm tracking-wide">Automatic mitigation active for 2 nodes in the last 30 minutes. Immediate review required.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-red-600 font-black text-xs rounded-xl uppercase tracking-widest hover:bg-slate-100 transition-colors">Review Incidents</button>
            <button className="px-6 py-3 bg-red-800 text-white font-black text-xs rounded-xl uppercase tracking-widest border border-red-700">Dismiss</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Threat Table */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
             <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><ShieldAlert className="text-red-600" /> Active Security Incidents</h3>
             <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Filter size={20}/></button>
                <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Select All</button>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[600px] no-scrollbar">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <tr>
                      <th className="px-8 py-6">Severity</th>
                      <th className="px-8 py-6">Device / Type</th>
                      <th className="px-8 py-6 text-center">Score</th>
                      <th className="px-8 py-6 text-right">Detected</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {THREAT_EVENTS.map((event) => (
                     <tr key={event.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${event.severity === 'critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                              {event.severity}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">{event.deviceName}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.type}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center justify-center gap-3">
                              <span className="text-xs font-black text-slate-700">{(event.score * 100).toFixed(0)}</span>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                 <div className="h-full bg-red-500" style={{ width: `${event.score * 100}%` }}></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <p className="text-[11px] font-bold text-slate-500">{event.detectedAt.split(' ')[0]}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{event.detectedAt.split(' ')[1]}</p>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Breakdown Charts */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-8 uppercase tracking-widest">Threat Vectors</h3>
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={THREAT_TYPES} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                       <Tooltip cursor={{fill: '#f8fafc'}} />
                       <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-2">
                 <Zap size={18} className="text-blue-600" />
                 MITRE Matrix Coverage
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 {MITRE_TECHNIQUES.map((tech) => (
                   <div key={tech.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                      <span className="text-[9px] font-black text-blue-600 uppercase mb-1 tracking-widest">{tech.id}</span>
                      <p className="text-[11px] font-bold text-slate-700 leading-tight mb-2 h-8 flex items-center">{tech.name}</p>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${tech.coverage === 'high' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                         {tech.coverage}
                      </span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-3 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                 Explore TTPs <ExternalLink size={12}/>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatCenter;
