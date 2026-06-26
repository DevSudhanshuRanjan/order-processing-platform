import API from './api';

export const placeOrder = async (orderData) => {
  const response = await API.post('/orders', orderData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await API.get('/orders');
  return response.data;
};
