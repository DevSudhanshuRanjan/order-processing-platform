import React from 'react';
import { toast, Toaster as HotToaster } from 'react-hot-toast';

// We configure a default toaster specifically for dashboards to match the dark theme
export const DashboardToaster = () => (
  <HotToaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: '#141b2b',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      },
      success: {
        iconTheme: {
          primary: '#10B981',
          secondary: '#141b2b',
        },
      },
      error: {
        iconTheme: {
          primary: '#EF4444',
          secondary: '#141b2b',
        },
      },
    }}
  />
);

// Re-export toast for convenience
export default toast;
