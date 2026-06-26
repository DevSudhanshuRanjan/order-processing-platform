import React, { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/dashboard/StatusBadge';
import SearchInput from '../../components/dashboard/SearchInput';
import FilterTabs from '../../components/dashboard/FilterTabs';
import { getAdminUsers, updateUserStatus } from '../../services/adminService';
import toast from '../../components/dashboard/Toast';
import Modal from '../../components/dashboard/Modal';

const USER_FILTERS = [
  { id: 'All', label: 'All Users' },
  { id: 'customer', label: 'Customers' },
  { id: 'vendor', label: 'Vendors' },
  { id: 'admin', label: 'Admins' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers({ search });
      let filtered = data.users;
      if (filter !== 'All') {
        filtered = filtered.filter(u => u.role === filter);
      }
      setUsers(filtered);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, search]);

  const handleUpdateStatus = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await updateUserStatus(selectedUser._id, newStatus);
      toast.success(`User status updated to ${newStatus}`);
      fetchUsers();
      setStatusModalOpen(false);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const columns = [
    {
      header: 'User',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1a1c1c] text-on-primary-container flex items-center justify-center font-bold">
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
      header: 'User ID', 
      key: '_id',
      render: (row) => <span className="font-mono text-xs text-on-primary-container">{row._id}</span>
    },
    { 
      header: 'Role', 
      key: 'role',
      render: (row) => (
        <span className="text-xs font-label-md px-2 py-1 rounded bg-white/5 text-on-primary-container capitalize border border-white/10">
          {row.role}
        </span>
      )
    },
    { 
      header: 'Joined', 
      key: 'joinedAt',
      render: (row) => <span className="text-sm text-on-primary-container">{new Date(row.createdAt).toLocaleDateString()}</span>
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
            onClick={() => { setSelectedUser(row); setStatusModalOpen(true); }}
            className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white transition-colors"
            title="Update Status"
          >
            <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary-fixed mb-2">User Management</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Manage all registered users on the platform.</p>
        </div>
        <SearchInput 
          placeholder="Search by name or email..." 
          value={search} 
          onChange={setSearch} 
        />
      </div>

      <FilterTabs 
        tabs={USER_FILTERS} 
        activeTab={filter} 
        onChange={setFilter} 
      />

      <DataTable 
        columns={columns} 
        data={users} 
        loading={loading}
        emptyTitle="No users found"
        emptyDescription={search ? "Try adjusting your search query." : "No users match the selected filter."}
      />

      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update User Access"
      >
        <div className="space-y-4">
          <p>Update access for <span className="text-white font-bold">{selectedUser?.name}</span></p>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {['active', 'blocked'].map(s => (
              <button
                key={s}
                onClick={() => handleUpdateStatus(s)}
                className={`p-3 rounded-lg border text-sm font-label-md transition-all text-left flex items-center justify-between
                  ${selectedUser?.status === s 
                    ? 'border-primary-fixed bg-primary-fixed/10 text-primary-fixed' 
                    : 'border-white/10 text-on-primary-container hover:bg-white/5 hover:text-white'
                  }
                `}
                disabled={statusUpdating}
              >
                <div className="flex items-center gap-2">
                  <StatusBadge status={s} />
                </div>
                {selectedUser?.status === s && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
