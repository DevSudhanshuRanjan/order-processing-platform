import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import AreaChart from '../../components/dashboard/charts/AreaChart';
import BarChart from '../../components/dashboard/charts/BarChart';
import DonutChart from '../../components/dashboard/charts/DonutChart';
import FilterTabs from '../../components/dashboard/FilterTabs';
import { SkeletonChart } from '../../components/dashboard/SkeletonLoader';
import { getVendorStats } from '../../services/vendorService';

const TIME_FILTERS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' },
];

const VendorAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getVendorStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4 mb-6">
          <div className="h-10 w-48 bg-white/5 rounded-xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart height="400px" />
          <SkeletonChart height="400px" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-white mb-2">Analytics & Reports</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Deep dive into your sales and customer metrics.</p>
        </div>
        <FilterTabs 
          tabs={TIME_FILTERS} 
          activeTab={timeFilter} 
          onChange={setTimeFilter} 
        />
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Gross Sales" 
          value={stats?.revenue * 1.15} 
          prefix="₹" 
          icon="show_chart" 
          color="#3B82F6"
        />
        <StatsCard 
          label="Net Earnings" 
          value={stats?.revenue} 
          prefix="₹" 
          icon="account_balance_wallet" 
          color="#10B981"
        />
        <StatsCard 
          label="Average Order Value" 
          value={stats?.orders ? Math.round(stats.revenue / stats.orders) : 0} 
          prefix="₹" 
          icon="receipt_long" 
          color="#8B5CF6"
        />
        <StatsCard 
          label="Conversion Rate" 
          value={4.2} 
          suffix="%" 
          icon="touch_app" 
          color="#EC4899"
        />
      </div>

      {/* Detailed Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-lg text-lg text-white">Sales Trend</h3>
            <button className="text-on-primary-container hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          <AreaChart data={stats?.revenueData || []} prefix="₹" height={350} />
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-lg text-lg text-white">Orders Volume</h3>
            <button className="text-on-primary-container hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          <BarChart data={stats?.ordersData || []} height={350} color="#F59E0B" />
        </div>
      </div>

      {/* Detailed Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="font-headline-lg text-lg text-white mb-6">Sales by Category</h3>
          <DonutChart data={stats?.topCategories || []} height={300} />
        </div>

        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="font-headline-lg text-lg text-white">Top Performing Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Sales</th>
                  <th className="p-4 pr-6">Revenue</th>
                </tr>
              </thead>
              <tbody className="text-white font-body-md text-sm">
                {[
                  { name: 'Classic Burger', cat: 'Burger', sales: 320, rev: 63680 },
                  { name: 'Cheese Pizza', cat: 'Pizza', sales: 150, rev: 44850 },
                  { name: 'Cold Coffee', cat: 'Drinks', sales: 120, rev: 17880 },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                    <td className="p-4 pl-6 font-medium">{item.name}</td>
                    <td className="p-4 text-on-primary-container">{item.cat}</td>
                    <td className="p-4">{item.sales}</td>
                    <td className="p-4 font-mono font-medium text-[#10B981]">₹{item.rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;
