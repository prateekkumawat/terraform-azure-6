import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Plus, Calendar, DollarSign, 
  Package, ChevronRight, CheckCircle2, Building2,
  Tag, Info
} from 'lucide-react';
import { getInvoices } from '../services/api';

export default function Invoices({ onOpenCreateInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await getInvoices(searchTerm);
      setInvoices(data);
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Invoice Stock Traceability Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify exact available stock and sales history linked to each Purchase Invoice Number
          </p>
        </div>

        <button
          onClick={onOpenCreateInvoice}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Purchase Invoice</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Invoice # or Vendor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Invoices List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            No invoices found. Create a new purchase invoice to record incoming stock.
          </div>
        ) : (
          invoices.map((inv) => (
            <div 
              key={inv.id}
              onClick={() => setSelectedInvoice(inv)}
              className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer flex flex-col justify-between space-y-4 border border-slate-800"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono text-xs font-bold">
                    {inv.invoice_number}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {inv.invoice_date}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {inv.vendor_name}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {inv.notes || 'Purchased IT hardware batch'}
                  </p>
                </div>
              </div>

              {/* Stock Status Bar for this invoice */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Invoice Available Stock</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {inv.total_available_stock} / {inv.total_received_stock} units
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full transition-all"
                    style={{ 
                      width: inv.total_received_stock > 0 
                        ? `${(inv.total_available_stock / inv.total_received_stock) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Sold/Issued: {inv.total_sold_stock} units</span>
                  <span className="font-mono font-bold text-slate-200">${parseFloat(inv.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invoice Detail Breakdown Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl p-6 rounded-2xl space-y-5 border border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                  {selectedInvoice.invoice_number}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedInvoice.vendor_name}</h3>
                <p className="text-xs text-slate-400">Invoice Date: {selectedInvoice.invoice_date} | Total Amount: ${parseFloat(selectedInvoice.total_amount).toFixed(2)}</p>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                className="text-slate-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            {selectedInvoice.notes && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{selectedInvoice.notes}</span>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Items Stock Availability Breakdown for Invoice #{selectedInvoice.invoice_number}
              </h4>

              <div className="space-y-3">
                {selectedInvoice.invoice_items.map((item) => {
                  const rem = item.quantity_remaining;
                  const total = item.quantity_received;
                  const pct = total > 0 ? (rem / total) * 100 : 0;
                  return (
                    <div key={item.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{item.item_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">SKU: {item.item_sku} | Cost: ${parseFloat(item.unit_cost).toFixed(2)}</div>
                        </div>

                        <div className="text-right font-mono text-xs">
                          <span className="font-extrabold text-emerald-400">{rem} Available</span>
                          <span className="text-slate-500"> / {total} Total Recv</span>
                        </div>
                      </div>

                      {/* Stock availability bar */}
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div 
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Sold/Issued from this invoice: <strong className="text-slate-200">{item.quantity_sold_or_issued} units</strong></span>
                        <span className="text-slate-500">{pct.toFixed(0)}% Stock Available</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
