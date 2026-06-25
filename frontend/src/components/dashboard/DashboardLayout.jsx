import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Breadcrumb from './Breadcrumb';

const DashboardLayout = ({ 
  navItems, 
  title, 
  subtitle, 
  children, 
  user,
  baseRoute = '/admin', // or '/vendor'
  theme = 'admin' // 'admin' or 'vendor'
}) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const bgClass = theme === 'admin' ? 'bg-[#000000]' : 'bg-[#1a1c1c]';
  const sidebarBg = theme === 'admin' ? 'bg-primary-container' : 'bg-[#121414]';
  const activeNavBg = theme === 'admin' ? 'bg-secondary-container text-on-secondary-container scale-[0.98]' : 'bg-[#ffffff] text-[#000000] scale-[0.98]';
  const inactiveNavText = theme === 'admin' ? 'text-on-primary-container' : 'text-outline';
  
  return (
    <div className={clsx(bgClass, "text-[#ffffff] min-h-screen flex selection:bg-primary-fixed selection:text-on-primary-fixed w-full fixed inset-0 z-[100] overflow-hidden")}>
      
      {/* SideNavBar (Desktop) */}
      <nav className={clsx("hidden md:flex flex-col p-4 h-screen w-64 fixed left-0 top-0 shadow-lg z-40 border-r border-white/5", sidebarBg)}>
        <div className="flex items-center gap-4 mb-stack-lg px-2 mt-4">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              alt="Avatar" 
              src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"} 
            />
          </div>
          <div className="overflow-hidden">
            <h1 className={clsx("font-headline-lg text-headline-lg text-[20px] truncate", theme === 'admin' ? 'text-primary-fixed' : 'text-on-primary')}>
              {title}
            </h1>
            <p className="font-label-sm text-label-sm text-on-primary-container truncate">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-grow overflow-y-auto hide-scrollbar">
          {navItems.map(tab => {
            const isActive = location.pathname === tab.path || (tab.path !== baseRoute && location.pathname.startsWith(tab.path));
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-4 py-3 mb-1 font-label-md text-label-md transition-all text-left",
                  isActive ? activeNavBg : `${inactiveNavText} hover:bg-white/5`
                )}
              >
                <span className={clsx("material-symbols-outlined", isActive && 'icon-fill')}>{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}

          <div className="mt-auto flex flex-col gap-2 pt-4">
            <Link to="/" className={clsx("flex items-center gap-3 rounded-xl px-4 py-3 font-label-md text-label-md transition-colors", `${inactiveNavText} hover:bg-white/5`)}>
              <span className="material-symbols-outlined">logout</span>
              Back to Store
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Tab Bar */}
      <div className={clsx("md:hidden fixed bottom-0 left-0 right-0 border-t border-white/5 z-[60] flex overflow-x-auto hide-scrollbar", sidebarBg)}>
        {navItems.slice(0, 5).map(tab => { // Limit to 5 on mobile bottom bar
          const isActive = location.pathname === tab.path || (tab.path !== baseRoute && location.pathname.startsWith(tab.path));
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={clsx(
                "flex-1 flex flex-col items-center gap-1 py-3 px-2 text-[10px] font-label-sm transition-colors min-w-[64px]",
                isActive ? 'text-white' : 'text-on-primary-container'
              )}
            >
              <span className={clsx("material-symbols-outlined text-[20px]", isActive && 'icon-fill')}>{tab.icon}</span>
              <span className="truncate w-full text-center">{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main className={clsx(
        "flex-1 md:ml-64 flex flex-col h-screen overflow-hidden",
        theme === 'vendor' && 'bg-[#0a0a0a]'
      )}>
        {/* Top Header / Breadcrumbs */}
        <header className="flex-shrink-0 p-margin-mobile md:px-margin-desktop md:py-6 flex items-center justify-between border-b border-white/5 bg-transparent z-10 sticky top-0 backdrop-blur-md">
          <Breadcrumb navItems={navItems} baseRoute={baseRoute} />
        </header>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop pb-24 md:pb-margin-desktop relative">
          <div className="max-w-container-max mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;
