import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/vendorService';
import toast from '../../components/dashboard/Toast';

const CATEGORIES = ['Burger', 'Pizza', 'Drinks', 'Dessert', 'Chinese'];

const VendorAddProduct = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: CATEGORIES[0],
    price: '',
    stock: '',
    status: 'active'
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setSaving(true);
    try {
      await createProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock) || 0
      }, selectedImage ? [selectedImage] : []);
      toast.success('Product created successfully');
      navigate('/vendor/products');
    } catch (error) {
      toast.error('Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h2 className="font-headline-xl text-headline-xl text-white">Add New Product</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col - Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="font-headline-lg text-lg text-white mb-6">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-label-md text-on-primary-container mb-2">Product Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#dce2f7] focus:outline-none"
                  placeholder="e.g. Classic Cheeseburger"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-label-md text-on-primary-container mb-2">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#dce2f7] focus:outline-none resize-none"
                  placeholder="Describe your product..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="font-headline-lg text-lg text-white mb-6">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-label-md text-on-primary-container mb-2">Selling Price (₹) *</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#dce2f7] focus:outline-none font-mono"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-label-md text-on-primary-container mb-2">Stock Quantity</label>
                <input 
                  type="number" 
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#dce2f7] focus:outline-none font-mono"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Meta & Image */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="font-headline-lg text-lg text-white mb-6">Organization</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-label-md text-on-primary-container mb-2">Category *</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#dce2f7] focus:outline-none appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#141b2b] text-white">{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-label-md text-on-primary-container mb-2">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#dce2f7] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="active" className="bg-[#141b2b] text-white">Active</option>
                  <option value="inactive" className="bg-[#141b2b] text-white">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="font-headline-lg text-lg text-white mb-4">Product Image</h3>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer group">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="material-symbols-outlined text-[40px] text-on-primary-container group-hover:text-white transition-colors mb-2">add_photo_alternate</span>
                <p className="text-sm font-label-md text-on-primary-container group-hover:text-white">Click to upload image</p>
                <p className="text-xs text-on-primary-container/70 mt-1">SVG, PNG, JPG (max. 2MB)</p>
                {selectedImage && (
                  <p className="text-xs text-green-400 mt-2">{selectedImage.name}</p>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-3 flex justify-end gap-4 border-t border-white/5 pt-6">
          <button 
            type="button"
            onClick={() => navigate('/vendor/products')}
            className="px-6 py-3 rounded-xl font-label-md text-on-primary-container hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl font-label-md bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorAddProduct;
