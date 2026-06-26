import API from './api';

export const getAdminStats = async () => {
  const response = await API.get('/admin/dashboard');
  return response.data;
};

export const getAdminVendors = async (params = {}) => {
  const response = await API.get('/admin/vendors', { params });
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await API.get('/admin/users', { params });
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  // Backend uses separate block/unblock endpoints, not a generic status endpoint
  const endpoint = status === 'blocked'
    ? `/admin/users/${id}/block`
    : `/admin/users/${id}/unblock`;
  const response = await API.patch(endpoint);
  return response.data;
};

export const updateVendorStatus = async (id, status) => {
  // Backend uses separate block/unblock endpoints
  const endpoint = status === 'blocked'
    ? `/admin/vendors/${id}/block`
    : `/admin/vendors/${id}/unblock`;
  const response = await API.patch(endpoint);
  return response.data;
};

export const getServiceAreas = async () => {
  // Service areas are at /api/service-areas, not /api/admin/service-areas
  const response = await API.get('/service-areas');
  return response.data;
};

export const createServiceArea = async (data) => {
  const response = await API.post('/service-areas', data);
  return response.data;
};

export const updateServiceArea = async (id, data) => {
  const response = await API.patch(`/service-areas/${id}`, data);
  return response.data;
};

export const deleteServiceArea = async (id) => {
  const response = await API.delete(`/service-areas/${id}`);
  return response.data;
};

export const getAdminOrders = async (params = {}) => {
  const response = await API.get('/admin/orders', { params });
  return response.data;
};

export const getSystemHealth = async () => {
  const response = await API.get('/health');
  return response.data;
};
