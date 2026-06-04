import React from 'react';
import { TRAFFIC_DATA } from '../data/mockData';
import { Activity as ActivityIcon, Clock, ChevronRight, Zap } from 'lucide-react';

const Activity = () => {
  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">System Activity Log</h1>
        <p className="text-slate-500 font-medium">Verbose history of all network transitions and system events.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="divide-y divide-slate-50">
            {Array.from({ length: 20 }).map((_, i) => (
               <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-6">
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <Zap size={20} />
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-sm font-black text-slate-900">Traffic Baseline Synchronized</span>
                           <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 tracking-widest">SYSTEM</span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                           <span className="flex items-center gap-1.5"><Clock size={12}/> 2 minutes ago</span>
                           <span>Ref ID: #LOG-{Math.floor(Math.random() * 90000) + 10000}</span>
                        </div>
                     </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
               </div>
            ))}
         </div>
         <div className="p-8 bg-slate-50/50 flex justify-center border-t border-slate-100">
            <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Load Older Activity</button>
         </div>
      </div>
    </div>
  );
};

export default Activity;
