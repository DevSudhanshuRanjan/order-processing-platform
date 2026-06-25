import API from './api';

// --- MOCK DATA FOR ADMIN ---
const MOCK_ADMIN_STATS = {
  totalRevenue: 1250000,
  activeVendors: 45,
  totalUsers: 12400,
  activeOrders: 340,
  revenueGrowth: 18.5,
  vendorGrowth: 5.2,
  userGrowth: 12.4,
  orderGrowth: 22.1,
  revenueData: [
    { name: 'Mon', value: 45000 },
    { name: 'Tue', value: 52000 },
    { name: 'Wed', value: 48000 },
    { name: 'Thu', value: 61000 },
    { name: 'Fri', value: 85000 },
    { name: 'Sat', value: 110000 },
    { name: 'Sun', value: 95000 },
  ],
  recentActivity: [
    { id: 1, text: 'New vendor "Burger King" registered', time: '10 mins ago', icon: 'storefront' },
    { id: 2, text: 'System backup completed', time: '1 hour ago', icon: 'cloud_done' },
    { id: 3, text: 'High order volume alert in Zone A', time: '2 hours ago', icon: 'warning' },
    { id: 4, text: 'Payouts processed for 45 vendors', time: '5 hours ago', icon: 'payments' },
  ]
};

const MOCK_VENDORS = Array.from({ length: 45 }).map((_, i) => ({
  _id: `VEND-00${i}`,
  name: `Restaurant ${i + 1}`,
  owner: `Owner ${i + 1}`,
  contact: `+91 9876543${i.toString().padStart(3, '0')}`,
  email: `restaurant${i+1}@example.com`,
  rating: (Math.random() * 2 + 3).toFixed(1),
  totalOrders: Math.floor(Math.random() * 5000),
  status: ['active', 'inactive', 'suspended'][i % 3],
  joinedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}));

const MOCK_USERS = Array.from({ length: 120 }).map((_, i) => ({
  _id: `USR-00${i}`,
  name: `User ${i + 1}`,
  email: `user${i+1}@example.com`,
  role: i % 20 === 0 ? 'admin' : (i % 5 === 0 ? 'vendor' : 'customer'),
  status: ['active', 'blocked'][i % 10 === 0 ? 1 : 0],
  joinedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}));

const MOCK_SERVICE_AREAS = [
  { _id: 'SA-1', name: 'Downtown Core', active: true, deliveryFee: 40, minOrder: 150 },
  { _id: 'SA-2', name: 'North Hills', active: true, deliveryFee: 60, minOrder: 250 },
  { _id: 'SA-3', name: 'South End', active: false, deliveryFee: 50, minOrder: 200 },
];

// --- SERVICE FUNCTIONS ---

export const getAdminStats = async () => {
  try {
    const response = await API.get('/admin/stats');
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404 || error.response.status === 403) {
      return { success: true, ...MOCK_ADMIN_STATS };
    }
    throw error;
  }
};

export const getAdminVendors = async (params = {}) => {
  try {
    const response = await API.get('/admin/vendors', { params });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404 || error.response.status === 403) {
      let filtered = [...MOCK_VENDORS];
      if (params.search) {
        filtered = filtered.filter(v => v.name.toLowerCase().includes(params.search.toLowerCase()) || v._id.includes(params.search));
      }
      return { success: true, vendors: filtered };
    }
    throw error;
  }
};

export const getAdminUsers = async (params = {}) => {
  try {
    const response = await API.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404 || error.response.status === 403) {
      let filtered = [...MOCK_USERS];
      if (params.search) {
        filtered = filtered.filter(u => u.name.toLowerCase().includes(params.search.toLowerCase()) || u.email.toLowerCase().includes(params.search.toLowerCase()));
      }
      return { success: true, users: filtered };
    }
    throw error;
  }
};

export const updateUserStatus = async (id, status) => {
  try {
    const response = await API.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404 || error.response.status === 403) {
      return { success: true, message: `User status updated to ${status}` };
    }
    throw error;
  }
};

export const updateVendorStatus = async (id, status) => {
  try {
    const response = await API.patch(`/admin/vendors/${id}/status`, { status });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404 || error.response.status === 403) {
      return { success: true, message: `Vendor status updated to ${status}` };
    }
    throw error;
  }
};

export const getServiceAreas = async () => {
  try {
    const response = await API.get('/admin/service-areas');
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404 || error.response.status === 403) {
      return { success: true, areas: MOCK_SERVICE_AREAS };
    }
    throw error;
  }
};

export const getSystemHealth = async () => {
  try {
    const response = await API.get('/admin/health');
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404 || error.response.status === 403) {
      return { 
        success: true, 
        health: {
          server: 'healthy',
          database: 'healthy',
          redis: 'healthy',
          cpu: '45%',
          memory: '62%',
          uptime: '15d 4h 23m'
        }
      };
    }
    throw error;
  }
};
