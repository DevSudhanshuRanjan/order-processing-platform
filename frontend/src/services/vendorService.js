import API from './api';

export const getVendorStats = async () => {
  const response = await API.get('/vendor/dashboard');
  return response.data;
};

export const getVendorOrders = async (params = {}) => {
  const response = await API.get('/vendor/orders', { params });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await API.get(`/vendor/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await API.patch(`/vendor/orders/${id}/status`, { status });
  return response.data;
};

export const getVendorProducts = async (params = {}) => {
  const response = await API.get('/vendor/products', { params });
  return response.data;
};

export const createProduct = async (data) => {
  const response = await API.post('/vendor/products', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await API.patch(`/vendor/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`/vendor/products/${id}`);
  return response.data;
};

export const updateInventory = async (id, stock) => {
  const response = await API.patch(`/vendor/products/${id}`, { stock });
  return response.data;
};

export const getVendorAnalytics = async () => {
  const response = await API.get('/vendor/analytics');
  return response.data;
};
