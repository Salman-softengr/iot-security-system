import React from 'react';
import { Clock, ChevronRight, Zap, ShieldCheck, Database, Terminal, Signal } from 'lucide-react';
import { motion } from 'framer-motion';

const Activity = () => {
  const activityData = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    title: [
      'Traffic Baseline Synchronized',
      'Anomaly Signature Detected',
      'Port Scan Mitigation Initiated',
      'New IoT Node Authenticated',
      'Firmware Audit Completed',
      'VLAN 999 Transition Executed'
    ][i % 6],
    actor: ['AI KERNEL', 'SYSTEM', 'ADMIN (SA)', 'EDGE_COLL'][i % 4],
    time: `${Math.floor(i * 15 + 2)} minutes ago`,
    ref: `#LOG-${Math.floor(Math.random() * 90000) + 10000}`,
    type: i % 3 === 0 ? 'info' : i % 5 === 0 ? 'warning' : 'success'
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">Operational Activity Log</h1>
          <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em]">Verbose telemetry history of system state transitions.</p>
        </div>
        <div className="flex gap-4">
           <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"><Database size={20}/></button>
           <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"><Signal size={20}/></button>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
               <Terminal size={16} className="text-blue-600" />
               Real-time Event Stream
            </h3>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">Live Connection</span>
         </div>
         
         <div className="divide-y divide-slate-50">
            {activityData.map((log, i) => (
               <motion.div 
                 key={log.id} 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.02 }}
                 className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-default"
               >
                  <div className="flex items-center gap-8">
                     <div className={`p-4 rounded-2xl border transition-all group-hover:scale-110 shadow-sm
                       ${log.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                         log.type === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                         'bg-blue-50 text-blue-600 border-blue-100'}
                     `}>
                        <Zap size={22} />
                     </div>
                     <div>
                        <div className="flex items-center gap-4 mb-1.5">
                           <span className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{log.title}</span>
                           <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 tracking-widest leading-none">{log.actor}</span>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span className="flex items-center gap-2 italic"><Clock size={14} className="opacity-50"/> {log.time}</span>
                           <span className="opacity-50">Reference ID: <span className="font-mono text-slate-500 font-bold">{log.ref}</span></span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[9px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase tracking-widest">Inspect Trace</div>
                     <ChevronRight size={22} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
               </motion.div>
            ))}
         </div>
         
         <div className="p-10 bg-slate-50/50 flex justify-center border-t border-slate-100">
            <button className="px-10 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-600 hover:border-blue-100 hover:shadow-xl transition-all active:scale-95">Load Historical Archive</button>
         </div>
      </div>
    </div>
  );
};

export default Activity;
