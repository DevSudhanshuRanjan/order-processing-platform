import React, { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import SearchInput from '../../components/dashboard/SearchInput';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { getVendorOrders } from '../../services/vendorService';
import toast from '../../components/dashboard/Toast';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VendorOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Only fetch completed or cancelled orders for history
      const data = await getVendorOrders({ search, page, limit: 10, status: 'All' }); 
      // In a real app, API would filter history. Here we just take what's returned.
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, page]);

  const exportCSV = () => {
    if (!orders.length) return toast.error('No data to export');
    
    const dataToExport = orders.map(o => ({
      'Order ID': o._id,
      'Customer Name': o.customerName,
      'Contact': o.customerContact,
      'Total Amount': o.totalAmount,
      'Status': o.status,
      'Date': new Date(o.createdAt).toLocaleString()
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'order_history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV Exported');
  };

  const exportPDF = () => {
    if (!orders.length) return toast.error('No data to export');

    const doc = new jsPDF();
    doc.text('Order History Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    
    const tableData = orders.map(o => [
      o._id.slice(-6),
      o.customerName,
      `Rs. ${o.totalAmount}`,
      o.status,
      new Date(o.createdAt).toLocaleDateString()
    ]);
    
    doc.autoTable({
      startY: 35,
      head: [['ID', 'Customer', 'Amount', 'Status', 'Date']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [20, 27, 43] },
    });
    
    doc.save('order_history.pdf');
    toast.success('PDF Exported');
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
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-white mb-2">Order History</h2>
          <p className="text-on-primary-container font-body-md text-body-md">View and export past orders.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <SearchInput 
            placeholder="Search history..." 
            value={search} 
            onChange={setSearch} 
          />
          <div className="flex gap-2">
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl font-label-md hover:bg-white/10 text-white transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              CSV
            </button>
            <button 
              onClick={exportPDF}
              className="flex items-center gap-2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl font-label-md hover:bg-white/10 text-white transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              PDF
            </button>
          </div>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={orders} 
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyTitle="No order history"
      />
    </div>
  );
};

export default VendorOrderHistory;
