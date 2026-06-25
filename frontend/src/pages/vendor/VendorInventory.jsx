import React, { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import SearchInput from '../../components/dashboard/SearchInput';
import { getVendorProducts, updateInventory } from '../../services/vendorService';
import toast from '../../components/dashboard/Toast';
import Modal from '../../components/dashboard/Modal';

const VendorInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getVendorProducts({ search });
      setProducts(data.products);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [search]);

  const handleUpdateStock = async () => {
    if (newStock === '' || isNaN(Number(newStock))) {
      toast.error('Please enter a valid number');
      return;
    }
    
    setUpdating(true);
    try {
      await updateInventory(selectedProduct._id, Number(newStock));
      toast.success('Inventory updated successfully');
      fetchInventory();
      setStockModalOpen(false);
    } catch (error) {
      toast.error('Failed to update inventory');
    } finally {
      setUpdating(false);
    }
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock.toString());
    setStockModalOpen(true);
  };

  const columns = [
    {
      header: 'Product',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#1a1c1c] flex-shrink-0">
            <img className="w-full h-full object-cover" alt={row.name} src={row.image} />
          </div>
          <span className="font-label-md text-white">{row.name}</span>
        </div>
      )
    },
    { 
      header: 'SKU', 
      key: '_id',
      render: (row) => <span className="font-mono text-xs text-on-primary-container">{row._id}</span>
    },
    { 
      header: 'Available Stock', 
      key: 'stock',
      render: (row) => (
        <span className={`font-mono font-medium ${row.stock === 0 ? 'text-[#EF4444]' : row.stock < 10 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
          {row.stock} units
        </span>
      )
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (row) => (
        <span className={`text-xs ${row.stock === 0 ? 'text-[#EF4444]' : row.stock < 10 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
          {row.stock === 0 ? 'Out of Stock' : row.stock < 10 ? 'Low Stock' : 'In Stock'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex justify-end">
          <button 
            onClick={() => openStockModal(row)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white transition-colors text-sm font-label-md flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">inventory</span>
            Update Stock
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-white mb-2">Inventory Management</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Monitor and update your product stock levels.</p>
        </div>
        <SearchInput 
          placeholder="Search inventory..." 
          value={search} 
          onChange={setSearch} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-md border border-[#EF4444]/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-[#EF4444] mb-2">
            <span className="material-symbols-outlined">warning</span>
            <h3 className="font-label-md">Out of Stock</h3>
          </div>
          <p className="text-3xl font-display-lg text-white">{products.filter(p => p.stock === 0).length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-[#F59E0B]/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-[#F59E0B] mb-2">
            <span className="material-symbols-outlined">inventory_2</span>
            <h3 className="font-label-md">Low Stock ({"<10"})</h3>
          </div>
          <p className="text-3xl font-display-lg text-white">{products.filter(p => p.stock > 0 && p.stock < 10).length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-on-primary-container mb-2">
            <span className="material-symbols-outlined">check_circle</span>
            <h3 className="font-label-md">Total Products</h3>
          </div>
          <p className="text-3xl font-display-lg text-white">{products.length}</p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={products} 
        loading={loading}
        emptyTitle="No inventory found"
      />

      <Modal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        title="Update Stock"
        actions={
          <>
            <button 
              onClick={() => setStockModalOpen(false)}
              className="px-4 py-2 rounded-lg font-label-md border border-white/10 text-on-primary-container hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdateStock}
              className="px-4 py-2 rounded-lg font-label-md bg-white text-black hover:bg-gray-200 transition-colors"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Save Stock'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p>Set new stock level for <span className="text-white font-bold">{selectedProduct?.name}</span>:</p>
          
          <div>
            <label className="block text-sm font-label-md text-on-primary-container mb-2">Available Quantity</label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setNewStock(prev => Math.max(0, Number(prev) - 1).toString())}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              
              <input 
                type="number" 
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                min="0"
                className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-center font-mono focus:border-[#dce2f7] focus:outline-none"
              />
              
              <button 
                onClick={() => setNewStock(prev => (Number(prev) + 1).toString())}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VendorInventory;
