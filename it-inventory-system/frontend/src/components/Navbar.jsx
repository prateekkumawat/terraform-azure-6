import React from 'react';
import { 
  Package, AlertTriangle, Plus, FileText, 
  ArrowUpRight, RefreshCw, Cpu
} from 'lucide-react';

export default function Navbar({ 
  dashboardData, 
  onOpenAddItem, 
  onOpenCreateInvoice, 
  onOpenRecordSale,
  onRefresh,
  loading 
}) {
  const lowStockCount = dashboardData?.low_stock_count || 0;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">IT Stock Ops</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Django + React
                </span>
              </div>
              <p className="text-xs text-slate-400">IT Hardware & Equipment Inventory Management</p>
            </div>
          </div>

          <button 
            onClick={onRefresh} 
            disabled={loading}
            className="md:hidden p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Low Stock Alert Badge */}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold shrink-0 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>{lowStockCount} Low Stock Alert{lowStockCount > 1 ? 's' : ''}</span>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700/50 transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Sync</span>
          </button>

          {/* Action Buttons */}
          <button
            onClick={onOpenCreateInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 hover:text-indigo-200 border border-indigo-700/50 text-xs font-semibold transition-all shadow-sm shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>+ Receive Stock (Invoice)</span>
          </button>

          <button
            onClick={onOpenRecordSale}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 hover:text-emerald-200 border border-emerald-700/50 text-xs font-semibold transition-all shadow-sm shrink-0"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Sell / Issue Stock</span>
          </button>

          <button
            onClick={onOpenAddItem}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Item</span>
          </button>
        </div>
      </div>
    </header>
  );
}
