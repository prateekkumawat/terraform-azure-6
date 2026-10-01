import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, Plus, AlertTriangle, 
  Layers, ArrowUpRight, SlidersHorizontal, RefreshCw,
  Edit2, PlusCircle, MinusCircle
} from 'lucide-react';
import { getItems, adjustItemStock } from '../services/api';

export default function Inventory({ 
  onOpenAddItem, 
  onOpenRecordSale,
  categories,
  onRefreshData 
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Quick Stock Adjust State
  const [adjustingItem, setAdjustingItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [adjustSubmitting, setAdjustSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getItems(searchTerm, selectedCategory);
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm, selectedCategory]);

  const handleQuickAdjust = async (e) => {
    e.preventDefault();
    if (!adjustingItem || !adjustQty) return;
    setAdjustSubmitting(true);
    try {
      await adjustItemStock(adjustingItem.id, parseInt(adjustQty), adjustNotes || 'Quick Stock Adjustment');
      setAdjustingItem(null);
      setAdjustQty('');
      setAdjustNotes('');
      fetchItems();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to adjust stock");
    } finally {
      setAdjustSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Hardware & Stock Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage Mice, Keyboards, HDMI/Ethernet Cables, Hubs, and IT Equipment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddItem}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Equipment SKU</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mouse, keyboard, cables, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === ''
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat.id.toString()
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table / Grid */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
            <p className="text-xs">Loading hardware inventory...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No items found</p>
            <p className="text-xs text-slate-500 mt-1">Try changing your search term or add a new hardware item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-4">Item Name & SKU</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Storage Location</th>
                  <th className="px-5 py-4">Unit Price</th>
                  <th className="px-5 py-4">Stock Available</th>
                  <th className="px-5 py-4">Reorder Level</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Name & SKU */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        <span className="text-indigo-400 font-semibold">{item.sku}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] font-semibold">
                        {item.category_name}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 font-mono text-slate-400">
                      {item.location}
                    </td>

                    {/* Unit Price */}
                    <td className="px-5 py-4 font-mono font-bold text-slate-200">
                      ${parseFloat(item.unit_price).toFixed(2)}
                    </td>

                    {/* Quantity Available */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-extrabold font-mono ${
                          item.is_low_stock ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {item.quantity_available}
                        </span>
                        {item.is_low_stock && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold animate-pulse">
                            LOW STOCK
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Reorder Level */}
                    <td className="px-5 py-4 font-mono text-slate-500">
                      {item.reorder_level} units
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setAdjustingItem(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-semibold border border-slate-700/60 transition-colors"
                          title="Adjust stock (+/-)"
                        >
                          Adjust
                        </button>
                        <button
                          onClick={() => onOpenRecordSale(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-[11px] font-semibold border border-emerald-700/60 transition-colors flex items-center gap-1"
                          title="Issue or sell stock"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Issue</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Stock Quick Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl space-y-4 border border-slate-700">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Adjust Stock Quantity</span>
              <button 
                onClick={() => setAdjustingItem(null)} 
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </h3>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="font-bold text-indigo-300">{adjustingItem.name}</div>
              <div className="text-slate-400 font-mono">Current Available Stock: {adjustingItem.quantity_available} units</div>
            </div>

            <form onSubmit={handleQuickAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quantity Adjustment (+ to add stock, - to deduct)
                </label>
                <input
                  type="number"
                  placeholder="e.g. +10 or -5"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adjustment Reason / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physical Audit count correction"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustSubmitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {adjustSubmitting ? 'Updating...' : 'Save Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
