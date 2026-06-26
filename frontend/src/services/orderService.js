import API from './api';

export const placeOrder = async (orderData) => {
  try {
    console.log(orderData);
    const response = await API.post('/orders', orderData);
    console.log("Hey");
    return response.data;
  } catch (error) {
    if (!error.response) {
      // Mock fallback
      return { success: true, orderId: "ORD" + Math.floor(Math.random() * 1000000) };
    }
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const response = await API.get('/orders');
    return response.data;
  } catch (error) {
    if (!error.response) {
      // Mock fallback
      return { 
        orders: [
          { _id: "ORD123", status: "Delivered", total: 499, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: "ORD124", status: "Preparing", total: 850, createdAt: new Date().toISOString() }
        ] 
      };
    }
    throw error;
  }
};
