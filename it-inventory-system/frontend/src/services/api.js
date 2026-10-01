import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardData = async () => {
  const res = await api.get('/dashboard/');
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get('/categories/');
  return res.data;
};

export const getItems = async (search = '', category = '') => {
  let url = '/items/';
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (params.toString()) url += `?${params.toString()}`;
  
  const res = await api.get(url);
  return res.data;
};

export const createItem = async (itemData) => {
  const res = await api.post('/items/', itemData);
  return res.data;
};

export const adjustItemStock = async (itemId, adjustment, notes = '') => {
  const res = await api.post(`/items/${itemId}/adjust_stock/`, { adjustment, notes });
  return res.data;
};

export const getInvoices = async (search = '') => {
  let url = '/invoices/';
  if (search) url += `?search=${encodeURIComponent(search)}`;
  const res = await api.get(url);
  return res.data;
};

export const createInvoice = async (invoiceData) => {
  const res = await api.post('/invoices/', invoiceData);
  return res.data;
};

export const getTransactions = async (search = '') => {
  let url = '/transactions/';
  if (search) url += `?search=${encodeURIComponent(search)}`;
  const res = await api.get(url);
  return res.data;
};

export const recordTransaction = async (txData) => {
  const res = await api.post('/transactions/', txData);
  return res.data;
};

export default api;
