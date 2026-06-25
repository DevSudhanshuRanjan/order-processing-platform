import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { getOrderById, updateOrderStatus } from '../../services/vendorService';
import toast from '../../components/dashboard/Toast';
import Modal from '../../components/dashboard/Modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VendorOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data.order);
      } catch (error) {
        toast.error('Failed to load order details');
        navigate('/vendor/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleUpdateStatus = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      setOrder(prev => ({ ...prev, status: newStatus }));
      setStatusModalOpen(false);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handlePrintInvoice = () => {
    if (!order) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Invoice', 14, 22);
    doc.setFontSize(12);
    doc.text(`Aura Eats Premium`, 14, 32);
    
    // Order Info
    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id}`, 14, 45);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 52);
    doc.text(`Status: ${order.status}`, 14, 59);
    
    // Customer Info
    doc.text(`Customer: ${order.customerName}`, 120, 45);
    doc.text(`Contact: ${order.customerContact}`, 120, 52);
    
    // Table
    const tableData = order.items.map(item => [item.name, item.quantity, `Rs. ${item.price}`, `Rs. ${item.quantity * item.price}`]);
    
    doc.autoTable({
      startY: 70,
      head: [['Product', 'Quantity', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [20, 27, 43] },
    });
    
    // Total
    const finalY = doc.lastAutoTable.finalY || 70;
    doc.setFontSize(12);
    doc.text(`Grand Total: Rs. ${order.totalAmount}`, 14, finalY + 15);
    
    doc.save(`invoice_${order._id}.pdf`);
    toast.success('Invoice generated');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div></div>;
  }

  if (!order) return null;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline-xl text-headline-xl text-white flex items-center gap-3">
              Order <span className="font-mono text-on-primary-container text-lg">#{order._id}</span>
            </h2>
            <p className="text-on-primary-container font-body-md text-sm">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={handlePrintInvoice} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-label-md text-sm text-white hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[18px]">print</span>
            Invoice
          </button>
          <button onClick={() => setStatusModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-label-md text-sm hover:bg-gray-200 transition-colors">
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="font-headline-lg text-lg text-white">Ordered Items</h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-on-primary-container">
                        <span className="material-symbols-outlined">fastfood</span>
                      </div>
                      <div>
                        <p className="font-label-md text-white">{item.name}</p>
                        <p className="text-sm text-on-primary-container">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-mono font-medium text-white">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 border-t border-white/10 bg-[#1a2333]/30">
              <div className="flex justify-between items-center font-label-md text-lg text-white">
                <span>Total Amount</span>
                <span className="font-mono text-xl">₹{order.totalAmount}</span>
              </div>
              <p className="text-right text-xs text-on-primary-container mt-1">Includes all taxes</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <h3 className="font-headline-lg text-lg text-white mb-4">Order Timeline</h3>
            <div className="relative pl-6 border-l-2 border-white/10 space-y-6">
              {['Pending', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, i) => {
                const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
                const currentIndex = statuses.indexOf(order.status);
                const stepIndex = statuses.indexOf(step);
                
                const isCompleted = stepIndex <= currentIndex && order.status !== 'Cancelled';
                const isActive = stepIndex === currentIndex && order.status !== 'Cancelled';
                
                if (order.status === 'Cancelled' && step !== 'Pending') {
                  if (i===1) return (
                    <div key="cancelled" className="relative">
                      <div className="absolute -left-[35px] w-4 h-4 rounded-full bg-red-500 border-4 border-[#141b2b]"></div>
                      <p className="font-label-md text-red-400">Cancelled</p>
                    </div>
                  );
                  return null;
                }

                return (
                  <div key={step} className={isCompleted ? 'opacity-100' : 'opacity-40'}>
                    <div className={`absolute -left-[35px] w-4 h-4 rounded-full border-4 border-[#141b2b] ${isCompleted ? 'bg-[#10B981]' : 'bg-white/20'}`}></div>
                    <p className={`font-label-md ${isActive ? 'text-[#10B981]' : 'text-white'}`}>{step}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <h3 className="font-headline-lg text-lg text-white mb-4">Customer Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">person</span>
                </div>
                <div>
                  <p className="font-label-md text-white">{order.customerName}</p>
                  <p className="text-sm text-on-primary-container">Customer</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[18px] text-on-primary-container">call</span>
                  <span className="text-white">{order.customerContact}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-[18px] text-on-primary-container mt-0.5">location_on</span>
                  <span className="text-white leading-relaxed">{order.deliveryAddress}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <h3 className="font-headline-lg text-lg text-white mb-4">Payment Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-primary-container">Method</span>
                <span className="font-label-md text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-primary-container">Status</span>
                <StatusBadge status={order.paymentStatus === 'Paid' ? 'Delivered' : 'Pending'} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <h3 className="font-headline-lg text-lg text-white mb-4">Delivery Notes</h3>
            <p className="text-sm text-on-primary-container leading-relaxed">
              {order.deliveryTime ? `Expected: ${order.deliveryTime}` : 'No specific delivery notes provided by the customer.'}
            </p>
          </div>
        </div>

      </div>

      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Order Status"
      >
        <div className="space-y-4">
          <p>Current Status: <StatusBadge status={order.status} /></p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
              <button
                key={s}
                onClick={() => handleUpdateStatus(s)}
                className={`p-3 rounded-lg border text-sm font-label-md transition-all text-left flex items-center justify-between
                  ${order.status === s 
                    ? 'border-[#dce2f7] bg-[#dce2f7]/10 text-white' 
                    : 'border-white/10 text-on-primary-container hover:bg-white/5 hover:text-white'
                  }
                `}
                disabled={statusUpdating}
              >
                {s}
                {order.status === s && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VendorOrderDetails;
