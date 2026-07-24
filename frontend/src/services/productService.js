import API from './api';

export const getProducts = async (params = {}) => {
  const response = await API.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data.product || response.data;
};

export const rateProduct = async (id, rating, comment = '') => {
  const response = await API.post(`/products/${id}/rate`, { rating, comment });
  return response.data;
};

export const getTopRatedProducts = async () => {
  const response = await API.get('/products/top-rated');
  return response.data;
};
