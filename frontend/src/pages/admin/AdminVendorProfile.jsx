import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/dashboard/StatusBadge';
import StatsCard from '../../components/dashboard/StatsCard';
import { getAdminVendors } from '../../services/adminService';
import toast from '../../components/dashboard/Toast';

const AdminVendorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await getAdminVendors();
        const found = data.vendors.find(v => v._id === id);
        if (found) {
          setVendor(found);
        } else {
          toast.error('Vendor not found');
          navigate('/admin/vendors');
        }
      } catch (error) {
        toast.error('Failed to load vendor details');
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div></div>;
  }

  if (!vendor) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary-fixed">Vendor Profile</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Identity */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-4xl font-bold mb-4">
              {vendor.name.charAt(0)}
            </div>
            <h3 className="font-headline-lg text-xl text-white mb-1">{vendor.name}</h3>
            <p className="text-sm text-on-primary-container mb-4">{vendor.email}</p>
            <StatusBadge status={vendor.status} />
            
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-primary-container text-[18px]">badge</span>
                <span className="font-mono text-sm text-white">{vendor._id}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-primary-container text-[18px]">person</span>
                <span className="text-sm text-white">{vendor.owner}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-primary-container text-[18px]">call</span>
                <span className="text-sm text-white">{vendor.contact}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-primary-container text-[18px]">calendar_today</span>
                <span className="text-sm text-white">Joined {new Date(vendor.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Stats & Action */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatsCard 
              label="Total Orders" 
              value={vendor.totalOrders} 
              icon="shopping_bag" 
              color="#3B82F6"
            />
            <StatsCard 
              label="Average Rating" 
              value={vendor.rating} 
              icon="star" 
              color="#F59E0B"
            />
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="font-headline-lg text-lg text-white mb-4">Danger Zone</h3>
            <div className="p-4 border border-[#EF4444]/20 bg-[#EF4444]/5 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-label-md text-white mb-1">Suspend Vendor</h4>
                <p className="text-sm text-on-primary-container">Temporarily disable this vendor's ability to receive orders or access the platform.</p>
              </div>
              <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg font-label-md hover:bg-red-600 transition-colors whitespace-nowrap">
                Suspend Account
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminVendorProfile;
