import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { Search } from 'lucide-react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ["All", "Burger", "Pizza", "Drinks", "Dessert", "Chinese"];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const gridRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({ category: category === 'All' ? undefined : category, search, page, limit: 9 });
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search, page]);

  useEffect(() => {
    if (!loading && products.length > 0 && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const formData = new FormData(e.target);
    const q = formData.get('q');
    setSearch(q);
    setSearchParams(q ? { search: q } : {});
  };

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-[#1a1c1c]">
      <main className="flex-grow pt-32 pb-margin-desktop px-gutter max-w-container-max mx-auto w-full">
        {/* Header Section */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary dark:text-white">Explore Menu</h1>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mt-2">Find your cravings, elevated.</p>
        </div>

        {/* Category & Search Bar */}
        <div className="mb-stack-lg flex flex-col md:flex-row justify-between items-center gap-stack-md sticky top-20 z-40 bg-background/90 dark:bg-[#1a1c1c]/90 backdrop-blur-md py-4">
          <div className="flex gap-stack-sm overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-6 py-2.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all duration-300 ${
                  category === cat 
                    ? 'bg-primary text-on-primary shadow-md hover:scale-105' 
                    : 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-high dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All Menu' : cat}
              </button>
            ))}
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant dark:text-gray-400">search</span>
            <input 
              name="q"
              defaultValue={search}
              className="w-full pl-12 pr-4 py-3 bg-surface-container dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary font-body-md text-body-md text-on-background dark:text-white placeholder:text-on-surface-variant dark:placeholder:text-gray-500 transition-all" 
              placeholder="Search menu..." 
              type="text"
            />
          </form>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-surface-container-lowest dark:bg-[#121414] rounded-2xl border border-outline-variant/30 dark:border-gray-800 overflow-hidden h-[400px] animate-pulse">
                  <div className="h-64 bg-surface-container dark:bg-gray-800 mb-4"></div>
                  <div className="p-stack-md">
                    <div className="h-6 bg-surface-container dark:bg-gray-800 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-surface-container dark:bg-gray-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-surface-container dark:bg-gray-800 rounded w-3/4 mb-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-stack-lg flex justify-center items-center gap-2">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-highest dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold">
                    {page}
                  </span>
                  <span className="text-on-surface-variant dark:text-gray-400 mx-2 font-label-sm text-label-sm">of {totalPages}</span>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-highest dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-surface-container dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant dark:text-gray-400">search_off</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-2">No Products Found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mb-6">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => { setCategory('All'); setSearch(''); }}
                className="px-6 py-3 rounded-lg bg-surface-container-high dark:bg-gray-800 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-highest dark:hover:bg-gray-700 transition-colors font-label-md text-label-md"
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

export default Products;
