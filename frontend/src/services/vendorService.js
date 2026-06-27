import API from './api';

// --- MOCK DATA ---
const MOCK_VENDOR_STATS = {
  revenue: 24500,
  orders: 142,
  customers: 89,
  growth: 14.5,
  pendingOrders: 12,
  totalProducts: 45,
  lowStock: 3,
  recentOrders: [
    { _id: 'ORD-001', customerName: 'Alice Chen', items: 3, totalAmount: 2850, status: 'Completed', createdAt: new Date().toISOString() },
    { _id: 'ORD-002', customerName: 'Marcus Johnson', items: 1, totalAmount: 1450, status: 'Preparing', createdAt: new Date().toISOString() },
    { _id: 'ORD-003', customerName: 'Sarah Williams', items: 5, totalAmount: 2100, status: 'Out for Delivery', createdAt: new Date().toISOString() },
  ],
  revenueData: [
    { name: 'Mon', value: 1200 },
    { name: 'Tue', value: 2100 },
    { name: 'Wed', value: 1800 },
    { name: 'Thu', value: 2400 },
    { name: 'Fri', value: 3500 },
    { name: 'Sat', value: 4200 },
    { name: 'Sun', value: 3800 },
  ],
  ordersData: [
    { name: 'Mon', value: 15 },
    { name: 'Tue', value: 24 },
    { name: 'Wed', value: 18 },
    { name: 'Thu', value: 28 },
    { name: 'Fri', value: 45 },
    { name: 'Sat', value: 55 },
    { name: 'Sun', value: 48 },
  ],
  topCategories: [
    { name: 'Burger', value: 45 },
    { name: 'Pizza', value: 30 },
    { name: 'Drinks', value: 15 },
    { name: 'Dessert', value: 10 },
  ]
};

const MOCK_ORDERS = Array.from({ length: 45 }).map((_, i) => ({
  _id: `ORD-100${i}`,
  customerName: `Customer ${i}`,
  customerContact: `+91 9876543${i.toString().padStart(3, '0')}`,
  deliveryAddress: `${100 + i} Main St, Delhi, 110001`,
  items: [
    { name: 'Classic Burger', quantity: 2, price: 199 },
    { name: 'Coke', quantity: 1, price: 50 }
  ],
  totalAmount: 448 + (i * 10),
  paymentMethod: i % 2 === 0 ? 'UPI' : 'Card',
  paymentStatus: 'Paid',
  status: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'][i % 5],
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
  deliveryTime: '30-45 mins'
}));

const MOCK_PRODUCTS = [
  { _id: 'P001', name: 'Classic Burger', category: 'Burger', price: 199, stock: 45, status: 'active', salesCount: 320, rating: 4.5, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80' },
  { _id: 'P002', name: 'Cheese Pizza', category: 'Pizza', price: 299, stock: 2, status: 'active', salesCount: 150, rating: 4.2, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=150&q=80' },
  { _id: 'P003', name: 'Cold Coffee', category: 'Drinks', price: 149, stock: 0, status: 'inactive', salesCount: 500, rating: 4.8, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=150&q=80' },
];

// --- SERVICE FUNCTIONS ---

export const getVendorStats = async () => {
  try {
    const response = await API.get('/vendor/dashboard');
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404) {
      // Return mock data if endpoint doesn't exist
      return { success: true, ...MOCK_VENDOR_STATS };
    }
    throw error;
  }
};

export const getVendorOrders = async (params = {}) => {
  try {
    const response = await API.get('/vendor/orders', { params });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404) {
      let filtered = [...MOCK_ORDERS];
      if (params.status && params.status !== 'All') {
        filtered = filtered.filter(o => o.status === params.status);
      }
      if (params.search) {
        filtered = filtered.filter(o => 
          o._id.includes(params.search) || 
          o.customerName.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);
      
      return { 
        success: true, 
        orders: paginated, 
        totalOrders: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        page 
      };
    }
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await API.get(`/vendor/orders/${id}`);
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404) {
      const order = MOCK_ORDERS.find(o => o._id === id) || MOCK_ORDERS[0];
      return { success: true, order };
    }
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await API.patch(`/vendor/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404) {
      return { success: true, message: 'Status updated (Mock)' };
    }
    throw error;
  }
};

export const getVendorProducts = async (params = {}) => {
  try {
    const response = await API.get('/vendor/products', { params });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404) {
      let filtered = [...MOCK_PRODUCTS];
      if (params.search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
      }
      return { 
        success: true, 
        products: filtered,
        totalProducts: filtered.length,
        totalPages: 1,
        page: 1
      };
    }
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    const response = await API.post('/vendor/products', data);
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404) {
      return { success: true, message: 'Product created successfully (Mock)', product: { _id: 'PNEW', ...data } };
    }
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await API.put(`/vendor/products/${id}`, data);
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404) {
      return { success: true, message: 'Product updated successfully (Mock)' };
    }
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/vendor/products/${id}`);
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404) {
      return { success: true, message: 'Product deleted successfully (Mock)' };
    }
    throw error;
  }
};

export const updateInventory = async (id, stock) => {
  try {
    const response = await API.patch(`/vendor/products/${id}/stock`, { stock });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404) {
      return { success: true, message: 'Inventory updated successfully (Mock)' };
    }
    throw error;
  }
};
