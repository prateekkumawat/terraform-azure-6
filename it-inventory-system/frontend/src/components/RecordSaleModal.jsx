import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { recordTransaction, getItems, getInvoices } from '../services/api';

export default function RecordSaleModal({ isOpen, onClose, initialItem, onSuccess }) {
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [issuedTo, setIssuedTo] = useState('');
  const [department, setDepartment] = useState('IT Engineering');
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedItemObj, setSelectedItemObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      getItems().then(data => {
        setItems(data);
        if (initialItem) {
          setItemId(initialItem.id.toString());
          setSelectedItemObj(initialItem);
          setUnitPrice(initialItem.unit_price);
        } else if (data.length > 0) {
          setItemId(data[0].id.toString());
          setSelectedItemObj(data[0]);
          setUnitPrice(data[0].unit_price);
        }
      }).catch(console.error);

      getInvoices().then(setInvoices).catch(console.error);
    }
  }, [isOpen, initialItem]);

  if (!isOpen) return null;

  const handleItemSelect = (id) => {
    setItemId(id);
    const obj = items.find(i => i.id.toString() === id.toString());
    setSelectedItemObj(obj);
    if (obj) setUnitPrice(obj.unit_price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const qtyNum = intValue(quantity);
    if (!itemId || qtyNum <= 0) {
      setError('Please select an item and enter valid quantity.');
      return;
    }

    if (selectedItemObj && selectedItemObj.quantity_available < qtyNum) {
      setError(`Insufficient stock available for ${selectedItemObj.name}. (Available: ${selectedItemObj.quantity_available})`);
      return;
    }

    setLoading(true);
    try {
      await recordTransaction({
        transaction_type: 'SALE_OUT',
        item: parseInt(itemId),
        quantity: qtyNum,
        unit_price: parseFloat(unitPrice || 0),
        invoice: invoiceId ? parseInt(invoiceId) : null,
        issued_to_or_customer: issuedTo || 'IT Team Member',
        department,
        notes
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to record transaction');
    } finally {
      setLoading(false);
    }
  };

  function intValue(v) {
    const p = parseInt(v);
    return isNaN(p) ? 0 : p;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg p-6 rounded-2xl space-y-4 border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            Issue or Sell Stock Item
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Item to Issue / Sell *</label>
            <select
              value={itemId}
              onChange={(e) => handleItemSelect(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            >
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name} (SKU: {it.sku} | Available Stock: {it.quantity_available})
                </option>
              ))}
            </select>
          </div>

          {selectedItemObj && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">{selectedItemObj.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">Location: {selectedItemObj.location}</div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-extrabold font-mono ${
                  selectedItemObj.quantity_available <= selectedItemObj.reorder_level ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {selectedItemObj.quantity_available} units
                </span>
                <div className="text-[10px] text-slate-500">Available Stock</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Quantity to Issue/Sell *</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Selling / Value Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Link to Invoice No (Optional)</label>
            <select
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- Deduct from oldest invoice (FIFO default) --</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} ({inv.vendor_name} | {inv.total_available_stock} avail)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Issued To / Recipient</label>
              <input
                type="text"
                placeholder="e.g. John Doe / Conf Room A"
                value={issuedTo}
                onChange={(e) => setIssuedTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="IT Engineering">IT Engineering</option>
                <option value="Software Development">Software Development</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Product Design">Product Design</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="HR & Admin">HR & Admin</option>
                <option value="Direct Client Sale">Direct Client Sale</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Notes</label>
            <input
              type="text"
              placeholder="Reason for issuance..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30"
            >
              {loading ? 'Processing...' : 'Confirm Stock Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
