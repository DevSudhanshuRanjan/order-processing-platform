import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/dashboard/StatusBadge';
import SearchInput from '../../components/dashboard/SearchInput';
import { getVendorProducts, deleteProduct } from '../../services/vendorService';
import toast from '../../components/dashboard/Toast';
import Modal from '../../components/dashboard/Modal';

const VendorProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getVendorProducts({ search });
      setProducts(data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(selectedProduct._id);
      toast.success('Product deleted successfully');
      fetchProducts();
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Product',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1a1c1c] flex-shrink-0">
            <img className="w-full h-full object-cover" alt={row.name} src={row.image} />
          </div>
          <div>
            <span className="font-label-md text-white block">{row.name}</span>
            <span className="text-xs text-on-primary-container block">{row.category}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Price', 
      key: 'price',
      render: (row) => <span className="font-mono text-white">₹{row.price}</span>
    },
    { 
      header: 'Stock', 
      key: 'stock',
      render: (row) => (
        <span className={`font-mono ${row.stock < 10 ? 'text-[#EF4444]' : 'text-white'}`}>
          {row.stock}
        </span>
      )
    },
    { 
      header: 'Sales', 
      key: 'salesCount',
      render: (row) => <span className="text-on-primary-container">{row.salesCount || 0}</span>
    },
    { 
      header: 'Rating', 
      key: 'rating',
      render: (row) => (
        <div className="flex items-center gap-1 text-[#F59E0B]">
          <span className="material-symbols-outlined text-[14px] icon-fill">star</span>
          <span className="text-white text-sm">{row.rating || 'N/A'}</span>
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
            onClick={() => navigate(`/vendor/products/${row._id}`)}
            className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button 
            onClick={() => { setSelectedProduct(row); setDeleteModalOpen(true); }}
            className="p-1.5 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 text-red-400 transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-white mb-2">Product Management</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Manage your menu items and catalog.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchInput 
            placeholder="Search products..." 
            value={search} 
            onChange={setSearch} 
          />
          <button 
            onClick={() => navigate('/vendor/products/add')}
            className="whitespace-nowrap flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl font-label-md hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Product
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={products} 
        loading={loading}
        emptyTitle="No products found"
        emptyDescription={search ? "Try adjusting your search query." : "You haven't added any products yet."}
        emptyAction={
          <button 
            onClick={() => navigate('/vendor/products/add')}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-label-md mx-auto hover:bg-gray-200"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Your First Product
          </button>
        }
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
        actions={
          <>
            <button 
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg font-label-md border border-white/10 text-on-primary-container hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg font-label-md bg-[#EF4444] text-white hover:bg-red-600 transition-colors"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete <span className="text-white font-bold">{selectedProduct?.name}</span>?</p>
        <p className="text-sm mt-2 text-on-primary-container">This action cannot be undone and will remove the product from your store.</p>
      </Modal>
    </div>
  );
};

export default VendorProducts;
