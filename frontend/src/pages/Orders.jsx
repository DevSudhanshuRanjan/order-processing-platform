import { useState, useEffect } from 'react';
import { getUserOrders } from '../services/orderService';
import { Package, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-success/10 text-success';
      case 'Preparing': return 'bg-warning/10 text-warning';
      case 'Pending': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'Out For Delivery': return 'bg-accent/10 text-accent';
      case 'Cancelled': return 'bg-danger/10 text-danger';
      default: return 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'Preparing': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-[#1a1c1c] text-on-background dark:text-white min-h-screen pt-32 pb-10">
      <div className="container mx-auto px-4 sm:px-10 max-w-[1024px]">
        <h1 className="text-4xl font-display font-bold text-primary dark:text-white mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="card dark:bg-[#121414] dark:border-gray-800 text-center py-16 rounded-2xl border border-outline-variant/30">
          <Package className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold dark:text-white mb-2">No Orders Yet</h3>
          <p className="text-on-surface-variant dark:text-gray-400">You haven't placed any orders.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card dark:bg-[#121414] dark:border-gray-800 rounded-2xl border border-outline-variant/30 hover:border-accent/30 dark:hover:border-accent/50 transition-colors cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
              <div className="flex items-center gap-6 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-surface-container dark:bg-gray-800 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg dark:text-white">Order #{order._id}</h3>
                  <p className="text-sm text-on-surface-variant dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()} • ₹{order.total}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Orders;
