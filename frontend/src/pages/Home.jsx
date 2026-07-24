import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuSection from '../components/MenuSection';
import HeroDashboard from '../components/HeroDashboard';
import { getVendors, getImageUrl } from '../services/vendorService';
import { getTopRatedProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [topProducts, setTopProducts] = useState([]);
  const [topProductsLoading, setTopProductsLoading] = useState(true);
  const [topRatedCustomers, setTopRatedCustomers] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getVendors();
        if (data.success) {
          setVendors(data.vendors);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setVendorsLoading(false);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const data = await getTopRatedProducts();
        if (data.success) {
          setTopProducts(data.products);
          // Collect customer names from those who rated the top products
          const customers = [];
          for (const product of data.products) {
            if (product.ratings && product.ratings.length > 0) {
              for (const r of product.ratings) {
                if (r.userName && !customers.includes(r.userName)) {
                  customers.push(r.userName);
                }
              }
            }
          }
          // Pick 3 random if enough
          const shuffled = customers.sort(() => 0.5 - Math.random());
          setTopRatedCustomers(shuffled.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching top rated:', error);
      } finally {
        setTopProductsLoading(false);
      }
    };
    fetchTopRated();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-[#1a1c1c]">
      {/* Hero Section - Widget Dashboard */}
      <HeroDashboard />

      {/* Menu Section - Products embedded directly (SPA) */}
      <MenuSection />

      {/* Restaurants Section */}
      <section className="py-stack-lg bg-surface dark:bg-[#1a1c1c] px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-stack-md">
            <div>
              <h2 className="font-headline-xl text-headline-xl text-primary dark:text-white">Our Restaurants</h2>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mt-2">Discover top-rated places, curated for you.</p>
            </div>
          </div>
          
          {/* Vendors Grid */}
          {vendorsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3 animate-pulse">
                  <div className="w-full aspect-[4/5] rounded-[24px] bg-surface-container dark:bg-gray-800"></div>
                  <div className="h-5 bg-surface-container dark:bg-gray-800 rounded w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : vendors.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
              {vendors.map((vendor) => (
                <Link 
                  key={vendor._id} 
                  to={`/restaurant/${vendor._id}`}
                  className="flex flex-col gap-3 group snap-start"
                >
                  <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden relative soft-shadow">
                    <div 
                      className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-110 transition-transform duration-500" 
                      style={{ 
                        backgroundImage: vendor.topProduct?.image 
                          ? `url(${getImageUrl(vendor.topProduct.image)})` 
                          : "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80')" 
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {vendor.topProduct && (
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#F97316] icon-fill">star</span>
                        <span className="font-label-sm text-label-sm font-bold text-white">
                          {vendor.topProduct.averageRating ? vendor.topProduct.averageRating.toFixed(1) : '0.0'}
                        </span>
                        <span className="text-gray-300 text-xs ml-1">({vendor.topProduct.numberOfRatings})</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-label-md text-label-md text-primary dark:text-white group-hover:text-[#F97316] transition-colors">{vendor.name}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 mt-1">{vendor.totalProducts} items</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-surface-container dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant dark:text-gray-400">store</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary dark:text-white mb-1">No Restaurants Yet</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-400">Check back soon for new restaurants.</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Offerings - Top Rated Products */}
      <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-stack-md">
          <h2 className="font-headline-xl text-headline-xl text-primary dark:text-white">Popular Offerings</h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mt-2 max-w-lg mx-auto">Curated favorites chosen by our discerning community.</p>
        </div>
        
        {topProductsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface-container-lowest dark:bg-[#121414] rounded-[24px] border border-outline-variant/30 dark:border-gray-800 overflow-hidden h-[340px] animate-pulse">
                <div className="h-48 bg-surface-container dark:bg-gray-800"></div>
                <div className="p-4">
                  <div className="h-5 bg-surface-container dark:bg-gray-800 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-surface-container dark:bg-gray-800 rounded w-full mb-1"></div>
                  <div className="h-3 bg-surface-container dark:bg-gray-800 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : topProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {topProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-surface-container dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant dark:text-gray-400">star</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary dark:text-white mb-1">No Top Rated Yet</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-400">Be the first to rate a product!</p>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="py-stack-lg bg-surface-container-low dark:bg-[#1a1c1c] px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-stack-md">
            <h2 className="font-headline-xl text-headline-xl text-primary dark:text-white">Aura Experiences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Testimonial 1 */}
            <div className="bg-surface-container-lowest dark:bg-[#121414] p-6 rounded-2xl soft-shadow flex flex-col gap-4 border border-transparent dark:border-gray-800 transition-colors">
              <div className="flex text-[#F97316]">
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300 italic">"The packaging alone feels like a luxury unboxing experience. The food arrived perfectly hot and beautifully presented. Aura Eats has ruined regular takeout for me."</p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-outline-variant/30 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#F97316]">{topRatedCustomers[0]?.charAt(0) || 'S'}</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-primary dark:text-white">{topRatedCustomers[0] || 'Sarah Jenkins'}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Food Critic</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-surface-container-lowest dark:bg-[#121414] p-6 rounded-2xl soft-shadow flex flex-col gap-4 border border-transparent dark:border-gray-800 transition-colors">
              <div className="flex text-[#F97316]">
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300 italic">"Incredible attention to detail. The Wagyu burger was cooked to a perfect medium-rare, even after a 20-minute delivery. Highly recommend for date nights in."</p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-outline-variant/30 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#F97316]">{topRatedCustomers[1]?.charAt(0) || 'D'}</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-primary dark:text-white">{topRatedCustomers[1] || 'David Chen'}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Regular Customer</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-surface-container-lowest dark:bg-[#121414] p-6 rounded-2xl soft-shadow flex flex-col gap-4 border border-transparent dark:border-gray-800 transition-colors">
              <div className="flex text-[#F97316]">
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star_half</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300 italic">"Finally, a delivery service that respects the food. The interface is clean, delivery is fast, and the quality of the partner restaurants is unmatched."</p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-outline-variant/30 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#F97316]">{topRatedCustomers[2]?.charAt(0) || 'E'}</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-primary dark:text-white">{topRatedCustomers[2] || 'Elena Rodriguez'}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Local Guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Luxury CTA Banner */}
      <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg">
        <div className="bg-primary text-on-primary rounded-[32px] overflow-hidden relative flex flex-col md:flex-row items-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
          
          <div className="p-8 md:p-16 flex-1 z-10 flex flex-col gap-stack-sm text-center md:text-left">
            <h2 className="font-headline-xl text-headline-xl text-on-primary">Elevate Your Evening.</h2>
            <p className="font-body-md text-body-md text-surface-dim dark:text-gray-300 max-w-md mx-auto md:mx-0">Join Aura Premium for zero delivery fees, priority preparation, and exclusive tasting menus from top chefs.</p>
            <div className="mt-4">
              <Link to="/register" className="bg-[#F97316] text-on-primary font-label-md text-label-md px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#F97316]/20 inline-block text-center">
                Join Aura Premium
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 h-64 md:h-full min-h-[300px] relative">
            <div 
              className="absolute inset-0 bg-cover bg-center w-full h-full" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCo1spbiqyJbUJcYXLoWJtW-ThJJscAHFmHoDHRrChnNdjYg81KZ4_GNae8fLN9td8LR2-P_qw4QZlkuYBzNPxxbPv9VC9PyF1dYEpR03vtSsM6BX7cxUNYvDeg51-31citAp7ZxNGzy9144yFOffwoe58o7TfreXbDzBbZxpqy9c_qjGPBPucjSrLLKZ1U6N_tSTnraRav7FztI0BjdRTJbuPiadFQBaF8oHaYGSjeyvjh5fyLU6shTIK1xMuoWHkapvTJjE2DsSQ')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;