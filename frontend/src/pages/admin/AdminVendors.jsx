import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/dashboard/StatusBadge';
import SearchInput from '../../components/dashboard/SearchInput';
import FilterTabs from '../../components/dashboard/FilterTabs';
import { getAdminVendors, updateVendorStatus } from '../../services/adminService';
import toast from '../../components/dashboard/Toast';
import Modal from '../../components/dashboard/Modal';

const VENDOR_FILTERS = [
  { id: 'All', label: 'All Vendors' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'suspended', label: 'Suspended' },
];

const AdminVendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await getAdminVendors({ search });
      let filtered = data.vendors;
      if (filter !== 'All') {
        filtered = filtered.filter(v => v.status === filter);
      }
      setVendors(filtered);
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [filter, search]);

  const handleUpdateStatus = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await updateVendorStatus(selectedVendor._id, newStatus);
      toast.success(`Vendor status updated to ${newStatus}`);
      fetchVendors();
      setStatusModalOpen(false);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const columns = [
    {
      header: 'Vendor Details',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
            {row.name.charAt(0)}
          </div>
          <div>
            <span className="font-label-md text-white block">{row.name}</span>
            <span className="text-xs text-on-primary-container block">{row.email}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Vendor ID', 
      key: '_id',
      render: (row) => <span className="font-mono text-xs text-on-primary-container">{row._id}</span>
    },
    { 
      header: 'Total Orders', 
      key: 'totalOrders',
      render: (row) => <span className="text-white">{row.totalOrders.toLocaleString()}</span>
    },
    { 
      header: 'Rating', 
      key: 'rating',
      render: (row) => (
        <div className="flex items-center gap-1 text-[#F59E0B]">
          <span className="material-symbols-outlined text-[14px] icon-fill">star</span>
          <span className="text-white text-sm">{row.rating}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => { setSelectedVendor(row); setStatusModalOpen(true); }}
            className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white transition-colors"
            title="Update Status"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
          </button>
          <button 
            onClick={() => navigate(`/admin/vendors/${row._id}`)}
            className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white transition-colors"
            title="View Profile"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary-fixed mb-2">Vendor Management</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Manage restaurant partners across the platform.</p>
        </div>
        <SearchInput 
          placeholder="Search by name or ID..." 
          value={search} 
          onChange={setSearch} 
        />
      </div>

      <FilterTabs 
        tabs={VENDOR_FILTERS} 
        activeTab={filter} 
        onChange={setFilter} 
      />

      <DataTable 
        columns={columns} 
        data={vendors} 
        loading={loading}
        emptyTitle="No vendors found"
        emptyDescription={search ? "Try adjusting your search query." : "No vendors match the selected filter."}
      />

      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Vendor Status"
      >
        <div className="space-y-4">
          <p>Update access for <span className="text-white font-bold">{selectedVendor?.name}</span></p>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {['active', 'inactive', 'suspended'].map(s => (
              <button
                key={s}
                onClick={() => handleUpdateStatus(s)}
                className={`p-3 rounded-lg border text-sm font-label-md transition-all text-left flex items-center justify-between
                  ${selectedVendor?.status === s 
                    ? 'border-primary-fixed bg-primary-fixed/10 text-primary-fixed' 
                    : 'border-white/10 text-on-primary-container hover:bg-white/5 hover:text-white'
                  }
                `}
                disabled={statusUpdating}
              >
                <div className="flex items-center gap-2">
                  <StatusBadge status={s} />
                </div>
                {selectedVendor?.status === s && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminVendors;
