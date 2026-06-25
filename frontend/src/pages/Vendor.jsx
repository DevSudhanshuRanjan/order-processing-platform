import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

// Import Vendor Sub-pages (lazy loading could be added here for optimization)
import VendorHome from './vendor/VendorHome';
import VendorOrders from './vendor/VendorOrders';
import VendorOrderDetails from './vendor/VendorOrderDetails';
import VendorProducts from './vendor/VendorProducts';
import VendorAddProduct from './vendor/VendorAddProduct';
import VendorInventory from './vendor/VendorInventory';
import VendorOrderHistory from './vendor/VendorOrderHistory';
import VendorAnalytics from './vendor/VendorAnalytics';
import VendorNotifications from './vendor/VendorNotifications';
import VendorSettings from './vendor/VendorSettings';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/vendor' },
  { id: 'orders', label: 'Orders', icon: 'shopping_bag', path: '/vendor/orders' },
  { id: 'products', label: 'Products', icon: 'restaurant_menu', path: '/vendor/products' },
  { id: 'inventory', label: 'Inventory', icon: 'inventory_2', path: '/vendor/inventory' },
  { id: 'analytics', label: 'Analytics', icon: 'leaderboard', path: '/vendor/analytics' },
  { id: 'history', label: 'Order History', icon: 'history', path: '/vendor/history' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications', path: '/vendor/notifications' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/vendor/settings' },
];

const Vendor = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout 
      navItems={NAV_ITEMS}
      title="Vendor Portal"
      subtitle={user?.name || "Aura Eats Premium"}
      user={user}
      baseRoute="/vendor"
      theme="vendor"
    >
      <Routes>
        <Route path="/" element={<VendorHome />} />
        <Route path="/orders" element={<VendorOrders />} />
        <Route path="/orders/:id" element={<VendorOrderDetails />} />
        <Route path="/products" element={<VendorProducts />} />
        <Route path="/products/add" element={<VendorAddProduct />} />
        <Route path="/inventory" element={<VendorInventory />} />
        <Route path="/analytics" element={<VendorAnalytics />} />
        <Route path="/history" element={<VendorOrderHistory />} />
        <Route path="/notifications" element={<VendorNotifications />} />
        <Route path="/settings" element={<VendorSettings />} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/vendor" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Vendor;
