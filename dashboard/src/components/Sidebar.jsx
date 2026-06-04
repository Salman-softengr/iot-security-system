import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Shield, Cpu, BarChart3, Settings, 
  Activity, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Devices', icon: Cpu, path: '/devices', badge: 24 },
    { name: 'Threats', icon: Shield, path: '/threats', badge: 3 },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Activity', icon: Activity, path: '/activity' }, // User added "more pages"
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      className="h-screen bg-[#0f172a] text-slate-400 fixed left-0 top-0 z-[60] border-r border-slate-800 transition-all duration-300 flex flex-col"
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Shield size={20} />
            </div>
            <span className="text-white font-black text-xl tracking-tight">IoT Shield</span>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto p-2 bg-blue-600 rounded-lg text-white">
            <Shield size={20} />
          </div>
        )}
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
              ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon size={22} className="min-w-[22px]" />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between overflow-hidden whitespace-nowrap">
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${item.badge > 5 ? 'bg-slate-700' : 'bg-red-500 text-white animate-pulse'}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-6 border-t border-slate-800 hover:text-white flex items-center gap-4 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={20} className="mx-auto" /> : (
          <>
            <ChevronLeft size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Collapse Menu</span>
          </>
        )}
      </button>
    </motion.div>
  );
};

export default Sidebar;
