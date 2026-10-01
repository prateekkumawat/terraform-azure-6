import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, Search, Plus, Calendar, User, 
  Building2, FileText, CheckCircle2, RefreshCw
} from 'lucide-react';
import { getTransactions } from '../services/api';

export default function SalesTransactions({ onOpenRecordSale }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions(searchTerm);
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [searchTerm]);

  const filteredTx = typeFilter 
    ? transactions.filter(t => t.transaction_type === typeFilter)
    : transactions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            Stock Issued & Sales Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit history of hardware equipment issued to employees, departments, or direct sales
          </p>
        </div>

        <button
          onClick={() => onOpenRecordSale()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Sale / Issue Hardware</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Item, Person, Dept, Invoice #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTypeFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === '' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            All Activity ({transactions.length})
          </button>
          <button
            onClick={() => setTypeFilter('SALE_OUT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'SALE_OUT' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Sales / Issued Out
          </button>
          <button
            onClick={() => setTypeFilter('STOCK_IN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'STOCK_IN' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Invoice Stock In
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
            <p className="text-xs">Loading sales logs...</p>
          </div>
        ) : filteredTx.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-4">Transaction Type</th>
                  <th className="px-5 py-4">Item & SKU</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4">Unit Price</th>
                  <th className="px-5 py-4">Total Amount</th>
                  <th className="px-5 py-4">Invoice Reference</th>
                  <th className="px-5 py-4">Recipient / Department</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      {tx.transaction_type === 'STOCK_IN' ? (
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                          + STOCK IN
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          - SOLD / ISSUED
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{tx.item_name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{tx.item_sku}</div>
                    </td>

                    <td className="px-5 py-4 font-mono font-extrabold text-sm text-white">
                      {tx.transaction_type === 'STOCK_IN' ? `+${tx.quantity}` : `-${tx.quantity}`}
                    </td>

                    <td className="px-5 py-4 font-mono text-slate-400">
                      ${parseFloat(tx.unit_price).toFixed(2)}
                    </td>

                    <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                      ${(tx.quantity * parseFloat(tx.unit_price)).toFixed(2)}
                    </td>

                    <td className="px-5 py-4 font-mono text-cyan-400">
                      {tx.invoice_number ? tx.invoice_number : <span className="text-slate-600">-</span>}
                    </td>

                    <td className="px-5 py-4">
                      {tx.issued_to_or_customer || tx.department ? (
                        <div>
                          <div className="font-semibold text-slate-200">{tx.issued_to_or_customer || 'Team Member'}</div>
                          {tx.department && <div className="text-[10px] text-slate-500">{tx.department}</div>}
                        </div>
                      ) : (
                        <span className="text-slate-600">N/A</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-400 font-mono">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
