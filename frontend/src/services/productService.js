import API from './api';

export const getProducts = async (params = {}) => {
  const response = await API.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data.product || response.data;
};

export const rateProduct = async (id, rating) => {
  const response = await API.post(`/products/${id}/rate`, { rating });
  return response.data;
};
