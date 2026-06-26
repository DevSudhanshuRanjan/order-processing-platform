import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import AreaChart from '../../components/dashboard/charts/AreaChart';
import { SkeletonChart } from '../../components/dashboard/SkeletonLoader';
import { getAdminStats } from '../../services/adminService';

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><SkeletonChart height="400px" /></div>
          <div className="h-[400px] bg-white/5 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 border-b border-white/5 gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary-fixed mb-2">Platform Overview</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Real-time metrics across the entire network.</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Total Revenue" 
          value={stats?.stats?.revenue || 0}
          prefix="₹" 
          icon="account_balance" 
          color="#10B981"
        />
        <StatsCard 
          label="Vendors" 
          value={stats?.stats?.vendors || 0} 
          icon="storefront" 
          color="#3B82F6"
        />
        <StatsCard 
          label="Customers" 
          value={stats?.stats?.users || 0}
          icon="group" 
          color="#8B5CF6"
        />
        <StatsCard 
          label="Total Orders" 
          value={stats?.stats?.orders || 0} 
          icon="local_shipping" 
          color="#F59E0B"
        />
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Revenue Chart */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-lg text-lg text-white">Platform Revenue</h3>
            <button className="text-xs px-3 py-1 bg-white/5 rounded-full text-on-primary-container hover:text-white transition-colors">Weekly</button>
          </div>
          <AreaChart data={stats?.revenueData || []} prefix="₹" height={350} />
        </div>
        
        {/* System Activity */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h3 className="font-headline-lg text-lg text-white">System Activity</h3>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-white/10">
              {(stats?.recentActivity || []).map((activity) => (
                <div key={activity.id} className="relative flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1a1c1c] border border-white/10 flex items-center justify-center text-on-primary-container z-10 flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">{activity.icon}</span>
                  </div>
                  <div className="pt-2 flex-1">
                    <p className="text-sm font-medium text-white mb-1">{activity.text}</p>
                    <p className="text-xs text-on-primary-container">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-white/10 bg-[#1a1c1c]/50 text-center">
            <button className="text-sm font-label-md text-primary-fixed hover:text-white transition-colors">View All Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
