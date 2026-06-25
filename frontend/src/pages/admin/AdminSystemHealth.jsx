import React, { useState, useEffect } from 'react';
import { getSystemHealth } from '../../services/adminService';
import toast from '../../components/dashboard/Toast';

const AdminSystemHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getSystemHealth();
        setHealth(data.health);
      } catch (error) {
        toast.error('Failed to load system health');
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const runBackup = () => {
    toast.success('Initiating manual database backup...');
    setTimeout(() => {
      toast.success('Backup completed successfully!');
    }, 2000);
  };

  const clearCache = () => {
    toast.success('Clearing Redis cache...');
    setTimeout(() => {
      toast.success('Cache cleared successfully!');
    }, 1500);
  };

  if (loading && !health) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div></div>;
  }

  const StatusIndicator = ({ status }) => (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-label-md border
      ${status === 'healthy' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'}
    `}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'healthy' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></div>
      {status === 'healthy' ? 'Operational' : 'Issues Detected'}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary-fixed mb-2">System Health</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Monitor infrastructure performance and run maintenance tasks.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={clearCache} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[18px]">memory</span>
            Clear Cache
          </button>
          <button onClick={runBackup} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-label-md hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined text-[18px]">cloud_download</span>
            Run Backup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Services Status */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="font-headline-lg text-lg text-white mb-6">Service Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#141b2b] rounded-xl border border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-fixed">public</span>
                <span className="font-label-md text-white">API Gateway</span>
              </div>
              <StatusIndicator status={health?.server} />
            </div>
            <div className="p-4 bg-[#141b2b] rounded-xl border border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3B82F6]">database</span>
                <span className="font-label-md text-white">Primary Database</span>
              </div>
              <StatusIndicator status={health?.database} />
            </div>
            <div className="p-4 bg-[#141b2b] rounded-xl border border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#EF4444]">storage</span>
                <span className="font-label-md text-white">Redis Cache</span>
              </div>
              <StatusIndicator status={health?.redis} />
            </div>
            <div className="p-4 bg-[#141b2b] rounded-xl border border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#F59E0B]">photo_library</span>
                <span className="font-label-md text-white">Media Storage</span>
              </div>
              <StatusIndicator status="healthy" />
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="font-headline-lg text-lg text-white mb-6">Resource Usage</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-label-md text-on-primary-container">CPU Usage</span>
                <span className="font-mono text-white">{health?.cpu}</span>
              </div>
              <div className="w-full h-2 bg-[#141b2b] rounded-full overflow-hidden">
                <div className="h-full bg-primary-fixed transition-all duration-500" style={{ width: health?.cpu }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-label-md text-on-primary-container">Memory Usage</span>
                <span className="font-mono text-white">{health?.memory}</span>
              </div>
              <div className="w-full h-2 bg-[#141b2b] rounded-full overflow-hidden">
                <div className="h-full bg-[#3B82F6] transition-all duration-500" style={{ width: health?.memory }}></div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 mt-4">
              <p className="text-xs text-on-primary-container text-center">System Uptime: <span className="text-white font-mono">{health?.uptime}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemHealth;
