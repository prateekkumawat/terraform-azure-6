import React from 'react';
import { 
  Package, AlertTriangle, FileText, ArrowUpRight, 
  TrendingUp, Layers, CheckCircle2, ShieldAlert, 
  Mouse, Cable, Cpu, Monitor, Headphones, Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Cell, PieChart, Pie 
} from 'recharts';

export default function Dashboard({ 
  dashboardData, 
  onNavigateTab, 
  onOpenRecordSale,
  onOpenCreateInvoice 
}) {
  if (!dashboardData) return null;

  const {
    total_items,
    total_stock_count,
    low_stock_count,
    total_invoices_count,
    total_sales_value,
    total_stock_issued,
    category_distribution = [],
    low_stock_items = [],
    recent_transactions = []
  } = dashboardData;

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            IT Inventory & Stock Control Center
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time stock monitoring, invoice tracking, mouse, keyboard, cable inventory & issue logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateInvoice}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all shadow-md"
          >
            Invoice Stock In
          </button>
          <button
            onClick={onOpenRecordSale}
            className="px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-md"
          >
            Issue / Sell Hardware
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Stock */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Stock</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white font-mono">{total_stock_count.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">Available Units</span> across all categories
            </p>
          </div>
        </div>

        {/* Card 2: Active SKUs */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hardware Catalog</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white font-mono">{total_items}</div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-cyan-400 font-semibold">{category_distribution.length} Categories</span> (Mice, Keyboards, Cables)
            </p>
          </div>
        </div>

        {/* Card 3: Invoices */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Invoices Tracked</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white font-mono">{total_invoices_count}</div>
            <p className="text-xs text-slate-400 mt-1">
              Stock-In origin trace per Invoice #
            </p>
          </div>
        </div>

        {/* Card 4: Total Sales/Issued */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Issued / Sold</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              ${total_sales_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-emerald-400 font-semibold">{total_stock_issued} units</span> issued to teams/clients
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts & Low Stock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Stock Distribution Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Stock Allocation by IT Category</h3>
              <p className="text-xs text-slate-400">Current available stock quantities across categories</p>
            </div>
            <button 
              onClick={() => onNavigateTab('inventory')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View Catalog &rarr;
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={category_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(val) => val.split(' ')[0]} 
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#6366f1' }}
                  labelStyle={{ color: '#f3f4f6', fontWeight: 'bold' }}
                />
                <Bar dataKey="total_stock" radius={[6, 6, 0, 0]}>
                  {category_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Category Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800">
            {category_distribution.map((cat, idx) => (
              <div key={cat.id} className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }} 
                />
                <div className="overflow-hidden text-xs">
                  <div className="font-semibold text-slate-200 truncate">{cat.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{cat.total_stock} in stock</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Urgent Alerts Panel */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Low Stock Reorders</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                {low_stock_count}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Items at or below minimum threshold requiring purchase reorder.
            </p>

            {low_stock_items.length === 0 ? (
              <div className="py-8 text-center bg-slate-900/40 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">All stock levels healthy!</p>
                <p className="text-[11px] text-slate-500">No reorders needed right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {low_stock_items.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {item.sku} | Loc: {item.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-amber-400 font-mono">
                        {item.quantity_available} <span className="text-[10px] text-slate-400 font-normal">left</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Min: {item.reorder_level}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenCreateInvoice}
            className="w-full mt-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all text-center"
          >
            Create Purchase Invoice &rarr;
          </button>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Stock Activity Log</h3>
            <p className="text-xs text-slate-400">Latest stock intake (invoices) and stock issued/sold</p>
          </div>
          <button 
            onClick={() => onNavigateTab('sales')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Full Activity Log &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Item / SKU</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Invoice Ref</th>
                <th className="px-4 py-3">Issued To / Dept</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recent_transactions.slice(0, 6).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    {tx.transaction_type === 'STOCK_IN' ? (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                        + INVOICE IN
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        - SOLD / ISSUED
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{tx.item_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{tx.item_sku}</div>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-white">
                    {tx.transaction_type === 'STOCK_IN' ? `+${tx.quantity}` : `-${tx.quantity}`}
                  </td>
                  <td className="px-4 py-3 font-mono text-cyan-400">
                    {tx.invoice_number ? tx.invoice_number : <span className="text-slate-600">N/A</span>}
                  </td>
                  <td className="px-4 py-3">
                    {tx.issued_to_or_customer || tx.department ? (
                      <span>{tx.issued_to_or_customer} <span className="text-slate-500">({tx.department})</span></span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
