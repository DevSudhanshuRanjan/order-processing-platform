import API from './api';

export const loginUser = async (data) => {
  try {
    const response = await API.post('/auth/login', data);
    return response.data;
  } catch (error) {
    // Mock fallback for UI demo purposes if no backend
    if (!error.response) {
      console.warn("Backend not found, using mock login");
      return {
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: 'u123',
          name: data.email.split('@')[0],
          email: data.email,
          role: data.email.includes('vendor') ? 'vendor' : data.email.includes('admin') ? 'admin' : 'customer'
        }
      };
    }
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const response = await API.post('/auth/register', data);
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, message: "User Created Successfully (Mock)" };
    }
    throw error;
  }
};
