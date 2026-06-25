import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

// Import Admin Sub-pages
import AdminHome from './admin/AdminHome';
import AdminVendors from './admin/AdminVendors';
import AdminVendorProfile from './admin/AdminVendorProfile';
import AdminUsers from './admin/AdminUsers';
import AdminOrders from './admin/AdminOrders';
import AdminReports from './admin/AdminReports';
import AdminServiceAreas from './admin/AdminServiceAreas';
import AdminSystemHealth from './admin/AdminSystemHealth';
import AdminSettings from './admin/AdminSettings';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: 'dashboard', path: '/admin' },
  { id: 'vendors', label: 'Vendors', icon: 'storefront', path: '/admin/vendors' },
  { id: 'users', label: 'Users', icon: 'people', path: '/admin/users' },
  { id: 'orders', label: 'Orders', icon: 'shopping_bag', path: '/admin/orders' },
  { id: 'service-areas', label: 'Service Areas', icon: 'map', path: '/admin/service-areas' },
  { id: 'reports', label: 'Reports', icon: 'analytics', path: '/admin/reports' },
  { id: 'system', label: 'System Health', icon: 'monitor_heart', path: '/admin/system' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/admin/settings' },
];

const Admin = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout 
      navItems={NAV_ITEMS}
      title="Admin Center"
      subtitle={user?.name || "Super Admin"}
      user={user}
      baseRoute="/admin"
      theme="admin"
    >
      <Routes>
        <Route path="/" element={<AdminHome />} />
        
        <Route path="/vendors" element={<AdminVendors />} />
        <Route path="/vendors/:id" element={<AdminVendorProfile />} />
        
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/orders" element={<AdminOrders />} />
        <Route path="/service-areas" element={<AdminServiceAreas />} />
        <Route path="/reports" element={<AdminReports />} />
        <Route path="/system" element={<AdminSystemHealth />} />
        <Route path="/settings" element={<AdminSettings />} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Admin;
