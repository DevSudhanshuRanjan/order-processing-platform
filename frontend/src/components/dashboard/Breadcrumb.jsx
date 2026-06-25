import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = ({ navItems = [], baseRoute = '/admin' }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Find the active nav item based on current path
  const currentNav = navItems.find(item => 
    currentPath === item.path || (item.path !== baseRoute && currentPath.startsWith(item.path))
  );

  return (
    <div className="flex items-center text-sm font-label-sm text-on-primary-container">
      <Link to={baseRoute} className="hover:text-white transition-colors flex items-center gap-1">
        <span className="material-symbols-outlined text-[16px]">home</span>
      </Link>
      
      {currentNav && currentPath !== baseRoute && (
        <>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-white flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">{currentNav.icon}</span>
            {currentNav.label}
          </span>
        </>
      )}

      {/* Logic for deep subpages (e.g. /vendor/products/add) could be added here if needed */}
    </div>
  );
};

export default Breadcrumb;
