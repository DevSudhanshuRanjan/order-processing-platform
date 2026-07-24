import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getVendors, getImageUrl } from '../services/vendorService';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ["All", "Burger", "Pizza", "Drinks", "Dessert", "Chinese"];

const VendorMenu = () => {
  const { vendorId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch vendor info
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await getVendors();
        if (data.success) {
          const found = data.vendors.find(v => v._id === vendorId);
          if (found) setVendor(found);
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
      }
    };
    fetchVendor();
  }, [vendorId]);

  // Fetch products for this vendor
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({
          vendorId,
          category: category === 'All' ? undefined : category,
          search,
          page,
          limit: 12,
        });
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [vendorId, category, search, page]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    setSearchParams(cat !== 'All' ? { category: cat } : {});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const q = e.target.q.value;
    setSearch(q);
    setSearchParams(q ? { search: q } : {});
  };

  return (
    <div className="bg-background dark:bg-[#1a1c1c] text-on-background dark:text-white min-h-screen">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-lg">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-on-surface-variant dark:text-gray-400 font-label-sm text-label-sm mb-stack-md">
          <Link to="/" className="hover:text-primary dark:hover:text-white transition-colors">Home</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
          <span className="text-primary dark:text-white">{vendor?.name || 'Restaurant'}</span>
        </div>

        {/* Vendor Header */}
        {vendor && (
          <div className="flex items-center gap-6 mb-stack-lg pb-stack-md border-b border-outline-variant/30 dark:border-gray-800">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-surface-container dark:bg-gray-800">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: vendor.topProduct?.image
                    ? `url(${getImageUrl(vendor.topProduct.image)})`
                    : "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80')"
                }}
              ></div>
            </div>
            <div>
              <h1 className="font-headline-xl text-headline-xl text-primary dark:text-white">{vendor.name}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mt-1">
                {vendor.totalProducts} items available
              </p>
              {vendor.topProduct && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-sm text-[#F97316] icon-fill">star</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">
                    {vendor.topProduct.averageRating ? vendor.topProduct.averageRating.toFixed(1) : '0.0'} ({vendor.topProduct.numberOfRatings} ratings)
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category & Search */}
        <div className="mb-stack-md flex flex-col md:flex-row justify-between items-center gap-stack-sm sticky top-20 z-40 bg-background/90 dark:bg-[#1a1c1c]/90 backdrop-blur-md py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all duration-300 ${
                  category === cat
                    ? 'bg-primary text-on-primary shadow-md hover:scale-105'
                    : 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-high dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All Menu' : cat}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-56">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant dark:text-gray-400 text-[18px]">search</span>
            <input
              name="q"
              defaultValue={search}
              className="w-full pl-9 pr-3 py-2 bg-surface-container dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-primary font-body-sm text-body-sm text-on-background dark:text-white placeholder:text-on-surface-variant dark:placeholder:text-gray-500 transition-all"
              placeholder="Search in this restaurant..."
              type="text"
            />
          </form>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-surface-container-lowest dark:bg-[#121414] rounded-xl border border-outline-variant/30 dark:border-gray-800 overflow-hidden h-[320px] animate-pulse">
                  <div className="h-48 bg-surface-container dark:bg-gray-800 mb-3"></div>
                  <div className="p-3">
                    <div className="h-5 bg-surface-container dark:bg-gray-800 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-surface-container dark:bg-gray-800 rounded w-full mb-1"></div>
                    <div className="h-3 bg-surface-container dark:bg-gray-800 rounded w-3/4 mb-3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} compact />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-stack-md flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-highest dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold">
                    {page}
                  </span>
                  <span className="text-on-surface-variant dark:text-gray-400 mx-1 font-label-sm text-label-sm">of {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-highest dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-surface-container dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[40px] text-on-surface-variant dark:text-gray-400">search_off</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary dark:text-white mb-1">No Items Found</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-400 mb-4">This restaurant has no items in this category yet.</p>
              <button
                onClick={() => { handleCategoryChange('All'); setSearch(''); }}
                className="px-4 py-2 rounded-lg bg-surface-container-high dark:bg-gray-800 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-highest dark:hover:bg-gray-700 transition-colors font-label-sm text-label-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorMenu;