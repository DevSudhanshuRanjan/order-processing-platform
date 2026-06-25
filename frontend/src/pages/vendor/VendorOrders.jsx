import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/dashboard/StatusBadge';
import SearchInput from '../../components/dashboard/SearchInput';
import FilterTabs from '../../components/dashboard/FilterTabs';
import { getVendorOrders, updateOrderStatus } from '../../services/vendorService';
import toast from '../../components/dashboard/Toast';
import Modal from '../../components/dashboard/Modal';

const ORDER_STATUS_FILTERS = [
  { id: 'All', label: 'All Orders' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Preparing', label: 'Preparing' },
  { id: 'Out for Delivery', label: 'Out for Delivery' },
  { id: 'Delivered', label: 'Delivered' },
  { id: 'Cancelled', label: 'Cancelled' },
];

const VendorOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getVendorOrders({ status: filter, search, page, limit: 10 });
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter, search, page]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      setStatusModalOpen(false);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusModalOpen(true);
  };

  const columns = [
    { 
      header: 'Order ID', 
      key: '_id',
      render: (row) => <span className="font-mono text-xs text-on-primary-container">{row._id}</span>
    },
    { 
      header: 'Customer', 
      key: 'customerName',
      render: (row) => (
        <div>
          <span className="font-medium text-white block">{row.customerName}</span>
          <span className="text-xs text-on-primary-container">{row.customerContact}</span>
        </div>
      )
    },
    { 
      header: 'Items', 
      key: 'items',
      render: (row) => (
        <div className="text-xs text-on-primary-container">
          {row.items.slice(0, 2).map((item, i) => (
            <div key={i}>{item.quantity}x {item.name}</div>
          ))}
          {row.items.length > 2 && <div>+{row.items.length - 2} more</div>}
        </div>
      )
    },
    { 
      header: 'Total', 
      key: 'totalAmount',
      render: (row) => <span className="font-mono font-medium text-white">₹{row.totalAmount}</span>
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    { 
      header: 'Date', 
      key: 'createdAt',
      render: (row) => (
        <div className="text-xs text-on-primary-container">
          <div>{new Date(row.createdAt).toLocaleDateString()}</div>
          <div>{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => openStatusModal(row)}
            className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white transition-colors"
            title="Update Status"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button 
            onClick={() => navigate(`/vendor/orders/${row._id}`)}
            className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white transition-colors"
            title="View Details"
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
          <h2 className="font-headline-xl text-headline-xl text-white mb-2">Order Management</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Manage incoming and active orders.</p>
        </div>
        <SearchInput 
          placeholder="Search by Order ID or Customer..." 
          value={search} 
          onChange={setSearch} 
        />
      </div>

      <FilterTabs 
        tabs={ORDER_STATUS_FILTERS} 
        activeTab={filter} 
        onChange={(tab) => { setFilter(tab); setPage(1); }} 
      />

      <DataTable 
        columns={columns} 
        data={orders} 
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyTitle="No orders found"
        emptyDescription={search ? "Try adjusting your search query." : "No orders match the selected filter."}
      />

      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Order Status"
        actions={
          <>
            <button 
              onClick={() => setStatusModalOpen(false)}
              className="px-4 py-2 rounded-lg font-label-md border border-white/10 text-on-primary-container hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleUpdateStatus(selectedOrder._id, selectedOrder.status)} // Just an example, actual select is below
              className="px-4 py-2 rounded-lg font-label-md bg-white text-black hover:bg-gray-200 transition-colors"
              disabled={statusUpdating}
            >
              {statusUpdating ? 'Updating...' : 'Confirm'}
            </button>
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <p>Update status for Order <span className="font-mono">{selectedOrder._id}</span></p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                <button
                  key={s}
                  onClick={() => handleUpdateStatus(selectedOrder._id, s)}
                  className={`p-3 rounded-lg border text-sm font-label-md transition-all text-left flex items-center justify-between
                    ${selectedOrder.status === s 
                      ? 'border-[#dce2f7] bg-[#dce2f7]/10 text-white' 
                      : 'border-white/10 text-on-primary-container hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  {s}
                  {selectedOrder.status === s && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VendorOrders;
