import React, { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/dashboard/StatusBadge';
import SearchInput from '../../components/dashboard/SearchInput';
import { getAdminOrders } from '../../services/adminService'; // We reuse this for mock data, in reality admin has its own
import toast from '../../components/dashboard/Toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Using vendor service as a mock fallback for admin orders
      const data = await getAdminOrders({ search, page, limit: 15 });
      console.log(data);
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
  }, [search, page]);

  const columns = [
    { 
      header: 'Order ID', 
      key: '_id',
      render: (row) => <span className="font-mono text-xs text-on-primary-container">{row._id}</span>
    },
    { 
      header: 'Vendor', 
      key: 'vendorName', // Mock data doesn't have this, but admin usually would
      render: (row) => <span className="font-medium text-white">Restaurant {(Math.floor(Math.random() * 45) + 1)}</span>
    },
    { 
      header: 'Customer', 
      key: 'customerName',
      render: (row) => (
        <div>
          <span className="font-medium text-white block">{row.customerName}</span>
          <span className="text-xs text-on-primary-container block">{row.customerContact}</span>
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
        <span className="text-xs text-on-primary-container">
          {new Date(row.createdAt).toLocaleDateString()} {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary-fixed mb-2">Order Tracking</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Monitor real-time orders across all vendors.</p>
        </div>
        <SearchInput 
          placeholder="Search Order ID..." 
          value={search} 
          onChange={setSearch} 
        />
      </div>

      <DataTable 
        columns={columns} 
        data={orders} 
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyTitle="No orders found"
      />
    </div>
  );
};

export default AdminOrders;
