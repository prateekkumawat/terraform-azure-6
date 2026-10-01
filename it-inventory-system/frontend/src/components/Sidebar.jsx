import React from 'react';
import { 
  LayoutDashboard, Package, FileText, 
  ArrowUpRight, Tag, Layers, Server
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, dashboardData }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
    { 
      id: 'inventory', 
      label: 'Inventory Stock Catalog', 
      icon: Package, 
      badge: dashboardData?.total_items || 0 
    },
    { 
      id: 'invoices', 
      label: 'Invoice Stock Hub', 
      icon: FileText, 
      badge: dashboardData?.total_invoices_count || 0 
    },
    { 
      id: 'sales', 
      label: 'Sales & Issued Logs', 
      icon: ArrowUpRight, 
      badge: dashboardData?.total_stock_issued || 0 
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 glass-panel border-r border-slate-800/80 p-4 flex flex-col justify-between h-auto md:h-[calc(100vh-65px)] sticky top-[65px]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-md shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive 
                        ? 'bg-indigo-500/30 text-indigo-300' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories Quick List */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Equipment Focus
          </p>
          <div className="px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Mice & Keyboards
              </span>
              <span className="text-slate-500 font-mono">Input</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                Cables & HDMI
              </span>
              <span className="text-slate-500 font-mono">Wiring</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Adapters & Hubs
              </span>
              <span className="text-slate-500 font-mono">Dongles</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Monitors & Audio
              </span>
              <span className="text-slate-500 font-mono">Display</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Footprint */}
      <div className="pt-4 border-t border-slate-800/80 mt-auto">
        <div className="px-3 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800/50 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="text-[11px] overflow-hidden">
            <div className="font-semibold text-slate-200">System Ready</div>
            <div className="text-slate-500 truncate">Port 8000 (Django) / 3000 (React)</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
