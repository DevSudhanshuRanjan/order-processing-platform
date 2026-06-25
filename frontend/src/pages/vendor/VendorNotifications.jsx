import React, { useState } from 'react';

const VendorNotifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', title: 'New Order Received', message: 'Order #ORD-1004 received from Jane Doe.', time: '2 mins ago', read: false },
    { id: 2, type: 'inventory', title: 'Low Stock Alert', message: 'Cheese Pizza is running low on stock (2 remaining).', time: '1 hour ago', read: false },
    { id: 3, type: 'system', title: 'System Update', message: 'We have updated our terms of service.', time: '1 day ago', read: true },
    { id: 4, type: 'review', title: 'New Review', message: 'Alice left a 5-star review for Classic Burger.', time: '2 days ago', read: true },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'order': return { icon: 'shopping_bag', color: 'bg-blue-500/20 text-blue-400' };
      case 'inventory': return { icon: 'inventory_2', color: 'bg-orange-500/20 text-orange-400' };
      case 'review': return { icon: 'star', color: 'bg-yellow-500/20 text-yellow-400' };
      default: return { icon: 'info', color: 'bg-gray-500/20 text-gray-400' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-white mb-2">Notifications</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Stay updated with your store activity.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-sm font-label-md text-primary-fixed hover:text-white transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-on-primary-container">
            <span className="material-symbols-outlined text-[48px] mb-4">notifications_off</span>
            <p>You have no notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((notif) => {
              const { icon, color } = getIcon(notif.type);
              return (
                <div 
                  key={notif.id} 
                  className={`p-5 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-white/[0.02]' : ''}`}
                  onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-label-md ${!notif.read ? 'text-white font-bold' : 'text-on-secondary'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-on-primary-container whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-sm text-on-primary-container">{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <div className="flex-shrink-0 flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-fixed"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorNotifications;
