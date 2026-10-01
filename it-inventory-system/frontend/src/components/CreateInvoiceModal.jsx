import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { createInvoice, getItems } from '../services/api';

export default function CreateInvoiceModal({ isOpen, onClose, onSuccess }) {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState([
    { item: '', quantity_received: '10', unit_cost: '0.00' }
  ]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      getItems().then(setAvailableItems).catch(console.error);
      // Auto generate sample invoice number
      setInvoiceNumber(`INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLineChange = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    
    // Auto populate unit_cost if item selected
    if (field === 'item') {
      const selectedObj = availableItems.find(i => i.id.toString() === value.toString());
      if (selectedObj) {
        updated[index].unit_cost = selectedObj.unit_price;
      }
    }
    setLineItems(updated);
  };

  const addLine = () => {
    setLineItems([...lineItems, { item: '', quantity_received: '10', unit_cost: '0.00' }]);
  };

  const removeLine = (index) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formattedLines = lineItems
      .filter(l => l.item && parseInt(l.quantity_received) > 0)
      .map(l => ({
        item: parseInt(l.item),
        quantity_received: parseInt(l.quantity_received),
        unit_cost: parseFloat(l.unit_cost || 0)
      }));

    if (formattedLines.length === 0) {
      setError('Please add at least one item with valid quantity to the invoice.');
      return;
    }

    setLoading(true);
    try {
      await createInvoice({
        invoice_number: invoiceNumber,
        vendor_name: vendorName,
        invoice_date: invoiceDate,
        notes,
        invoice_items: formattedLines
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl p-6 rounded-2xl space-y-4 border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Receive Stock via New Purchase Invoice
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Invoice Number *</label>
              <input
                type="text"
                placeholder="e.g. INV-2026-001"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Vendor / Supplier *</label>
              <input
                type="text"
                placeholder="e.g. TechSupplies Inc."
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Invoice Date *</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Notes / Order Reference</label>
            <input
              type="text"
              placeholder="e.g. Q1 IT Hardware replenishment order"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Line Items */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                Invoice Line Items (Incoming Hardware Stock)
              </label>
              <button
                type="button"
                onClick={addLine}
                className="text-purple-400 hover:text-purple-300 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item Line
              </button>
            </div>

            {lineItems.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <select
                    value={line.item}
                    onChange={(e) => handleLineChange(idx, 'item', e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">-- Select Item (Mouse, Keyboard, Cable...) --</option>
                    {availableItems.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} (SKU: {it.sku} | Curr Stock: {it.quantity_available})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty Recv"
                    value={line.quantity_received}
                    onChange={(e) => handleLineChange(idx, 'quantity_received', e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="w-28">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Unit Cost $"
                    value={line.unit_cost}
                    onChange={(e) => handleLineChange(idx, 'unit_cost', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLine(idx)}
                    className="p-1.5 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
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
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/30"
            >
              {loading ? 'Processing...' : 'Save & Receive Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
