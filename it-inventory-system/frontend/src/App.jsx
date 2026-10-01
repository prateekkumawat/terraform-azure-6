import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Invoices from './components/Invoices';
import SalesTransactions from './components/SalesTransactions';

import AddItemModal from './components/AddItemModal';
import CreateInvoiceModal from './components/CreateInvoiceModal';
import RecordSaleModal from './components/RecordSaleModal';

import { getDashboardData, getCategories } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);
  const [saleItemTarget, setSaleItemTarget] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchGlobalData = async () => {
    setLoading(true);
    try {
      const [dash, cats] = await Promise.all([
        getDashboardData(),
        getCategories()
      ]);
      setDashboardData(dash);
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load global application data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const handleOpenRecordSale = (item = null) => {
    setSaleItemTarget(item);
    setIsRecordSaleOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-card px-4 py-3 rounded-xl border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        dashboardData={dashboardData}
        onOpenAddItem={() => setIsAddItemOpen(true)}
        onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
        onOpenRecordSale={() => handleOpenRecordSale(null)}
        onRefresh={fetchGlobalData}
        loading={loading}
      />

      {/* Main Layout Area */}
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dashboardData={dashboardData}
        />

        {/* Content View */}
        <main className="flex-1 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <Dashboard
              dashboardData={dashboardData}
              onNavigateTab={setActiveTab}
              onOpenRecordSale={() => handleOpenRecordSale(null)}
              onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory
              onOpenAddItem={() => setIsAddItemOpen(true)}
              onOpenRecordSale={handleOpenRecordSale}
              categories={categories}
              onRefreshData={fetchGlobalData}
            />
          )}

          {activeTab === 'invoices' && (
            <Invoices
              onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
            />
          )}

          {activeTab === 'sales' && (
            <SalesTransactions
              onOpenRecordSale={() => handleOpenRecordSale(null)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        categories={categories}
        onSuccess={() => {
          fetchGlobalData();
          showToast("New Hardware Item SKU created successfully!");
        }}
      />

      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        onSuccess={() => {
          fetchGlobalData();
          showToast("Purchase Invoice saved and hardware stock updated!");
        }}
      />

      <RecordSaleModal
        isOpen={isRecordSaleOpen}
        onClose={() => {
          setIsRecordSaleOpen(false);
          setSaleItemTarget(null);
        }}
        initialItem={saleItemTarget}
        onSuccess={() => {
          fetchGlobalData();
          showToast("Hardware Stock issue / Sale recorded successfully!");
        }}
      />
    </div>
  );
}
