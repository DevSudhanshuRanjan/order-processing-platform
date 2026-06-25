import React from 'react';
import clsx from 'clsx';

const STATUS_COLORS = {
  // Order Statuses
  Pending: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  Confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Preparing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Ready: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Out for Delivery': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  
  // User/Vendor Statuses
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  blocked: 'bg-red-500/10 text-red-400 border-red-500/20',
  suspended: 'bg-orange-500/10 text-orange-400 border-orange-500/20',

  // Verification
  verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  unverified: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

const StatusBadge = ({ status, className }) => {
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  
  // Capitalize first letter if it's lowercase (like active/inactive)
  const displayStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label-md border',
      colorClass,
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {displayStatus}
    </span>
  );
};

export default StatusBadge;
