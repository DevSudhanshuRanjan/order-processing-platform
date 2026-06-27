import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import AreaChart from '../../components/dashboard/charts/AreaChart';
import BarChart from '../../components/dashboard/charts/BarChart';
import DonutChart from '../../components/dashboard/charts/DonutChart';
import { SkeletonChart } from '../../components/dashboard/SkeletonLoader';
import { getVendorStats } from '../../services/vendorService';

const VendorHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getVendorStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch vendor stats:', error);
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
          <div className="lg:col-span-2"><SkeletonChart height="300px" /></div>
          <div><SkeletonChart height="300px" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 border-b border-white/5 gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-white mb-2">Overview</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Your business performance today.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-white/10 transition-colors text-white">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Today
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Total Revenue" 
          value={stats?.stats?.revenue} 
          prefix="₹" 
          icon="payments" 
          color="#10B981"
          trendValue={`+${stats?.stats?.growth}% from yesterday`}
          trendUp={true}
        />
        <StatsCard 
          label="Delivered Orders" 
          value={stats?.stats?.deliveredOrders} 
          icon="shopping_bag" 
          color="#3B82F6"
          trendValue="+5% from yesterday"
          trendUp={true}
        />
        <StatsCard 
          label="Total Products" 
          value={stats?.stats?.totalProducts} 
          icon="group" 
          color="#EC4899"
          trendValue="-2% from yesterday"
          trendUp={false}
        />
        <StatsCard 
          label="Pending Orders" 
          value={stats?.stats?.pendingOrders} 
          icon="schedule" 
          color="#F59E0B"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="font-label-md text-label-md text-white mb-6">Revenue Over Time</h3>
          <AreaChart data={stats?.stats?.revenueData || []} prefix="₹" />
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="font-label-md text-label-md text-white mb-6">Top Categories</h3>
          <DonutChart data={stats?.stats?.topCategories || []} />
        </div>
      </div>

      {/* Recent Orders & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-headline-lg text-headline-lg text-white text-[20px]">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-white font-body-md text-sm">
                {(stats?.stats?.recentOrders || []).map(order => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-on-primary-container">{order._id}</td>
                    <td className="p-4 font-medium">{order.customerName}</td>
                    <td className="p-4 text-on-primary-container">{order.items} items</td>
                    <td className="p-4 font-mono font-medium">₹{order.totalAmount}</td>
                    <td className="p-4 pr-6">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Orders Bar Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="font-label-md text-label-md text-white mb-6">Weekly Orders</h3>
          <BarChart data={stats?.stats?.ordersData || []} height={250} color="#8B5CF6" />
        </div>
      </div>
    </div>
  );
};

export default VendorHome;
