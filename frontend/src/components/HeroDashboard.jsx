import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { getProducts } from '../services/productService';
import { getUserOrders } from '../services/orderService';
import { getImageUrl, getVendorStats } from '../services/vendorService';
import LocationPromptModal from './LocationPromptModal';

const HeroDashboard = () => {
  const { isLoggedIn, role } = useAuth();
  const { cartItems, subtotal, totalCartItems } = useCart();
  const { serviceable, loading: locationLoading, getCurrentLocation } = useLocation();
  
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [vendorStats, setVendorStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const totalQty = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Show location prompt modal for logged-in customers who haven't been asked yet
  const isCustomer = isLoggedIn && role === 'customer';
  const hasCachedLocation = !!localStorage.getItem('aura_location_cache');
  const locationDenied = localStorage.getItem('aura_location_denied') === 'true';
  const hasLocation = hasCachedLocation || serviceable;

  // Track if we've already attempted verification in this session
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  // On customer login, always verify location permission by attempting to get location
  // This catches cases where user previously allowed but later revoked browser permission
  useEffect(() => {
    if (isCustomer && !verificationAttempted && !locationLoading) {
      setVerificationAttempted(true);
      // Attempt to get location - will succeed if permission granted, fail if denied
      getCurrentLocation();
    }
  }, [isCustomer, verificationAttempted, locationLoading, getCurrentLocation]);

  // Show modal if customer doesn't have location and hasn't explicitly denied
  useEffect(() => {
    if (isCustomer && !serviceable && !locationDenied && !locationLoading) {
      setShowLocationModal(true);
    }
  }, [isCustomer, serviceable, locationDenied, locationLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, orderRes, vendorRes] = await Promise.allSettled([
          getProducts({ page: 1, limit: 4 }),
          role === 'customer' ? getUserOrders() : Promise.resolve(null),
          getVendorStats().catch(() => null),
        ]);

        if (productRes.status === 'fulfilled' && productRes.value) {
          const products = productRes.value.products || [];
          setFeaturedProduct(products.length > 0 ? products[0] : null);
        }

        if (orderRes.status === 'fulfilled' && orderRes.value) {
          const orders = orderRes.value.orders || [];
          setRecentOrders(orders.slice(0, 3));
        }

        if (vendorRes.status === 'fulfilled' && vendorRes.value) {
          setVendorStats(vendorRes.value);
        }
      } catch (err) {
        console.error('Hero widget fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role]);

  const defaultFoodImage = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80";
  const burgerImage = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80";
  const restaurantImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80";

  return (
    <section className="relative pt-28 pb-12 md:pt-32 md:pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        
        {/* ─── Left Column: Hero Text ─── */}
        <div className="lg:col-span-5 z-10 flex flex-col justify-center gap-4">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary dark:text-white animate-reveal leading-tight">
            Fast Delivery,<br/>
            Fresh Food,<br/>
            <span className="text-secondary dark:text-gray-300">Delivered To Your Door.</span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 max-w-md animate-reveal delay-100">
            Experience quiet luxury in every bite. Curated ingredients, seamless ordering, and food that arrives perfectly prepared.
          </p>
          <div className="flex flex-wrap items-center gap-3 animate-reveal delay-200">
            <Link to="/register" className="bg-[#F97316] text-on-primary font-label-md text-label-md px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#F97316]/20 inline-block text-center">
              Order Now
            </Link>
            <Link to="/#menu-section" className="bg-transparent text-primary dark:text-white border border-outline dark:border-gray-700 font-label-md text-label-md px-6 py-3 rounded-xl hover:bg-surface-container dark:hover:bg-gray-800 transition-colors duration-300 inline-block text-center">
              Explore Menu
            </Link>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 pt-2 animate-reveal delay-300">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#F97316] icon-fill text-lg">star</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">4.9 (2k+ Reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary dark:text-gray-400 text-lg">schedule</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Under 30 mins</span>
            </div>
            {serviceable ? (
              <div className="flex items-center gap-1.5" title="Delivery available">
                <span className="material-symbols-outlined text-lg text-green-600 dark:text-green-400">check_circle</span>
                <span className="font-label-sm text-label-sm text-green-600 dark:text-green-400">Deliverable</span>
              </div>
            ) : isCustomer ? (
              <div className="flex items-center gap-1.5">
                {locationLoading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-pulse text-gray-400">my_location</span>
                    <span className="font-label-sm text-label-sm text-gray-400">Checking...</span>
                  </>
                ) : (
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="flex items-center gap-1.5 hover:text-primary dark:hover:text-white transition-colors group"
                    title="Check delivery availability"
                  >
                    <span className="material-symbols-outlined text-lg text-on-surface-variant dark:text-gray-400 group-hover:text-primary dark:group-hover:text-white">my_location</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 group-hover:text-primary dark:group-hover:text-white">Check if deliverable</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5" title="Sign in to check delivery">
                <span className="material-symbols-outlined text-lg text-on-surface-variant dark:text-gray-400">location_off</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Not available</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Column: Widget Dashboard ─── */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 animate-reveal delay-200">

          {/* ── Widget 1 (2x2): Recommended Dish ── */}
          <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group bg-surface-container-lowest dark:bg-[#121414] border border-outline-variant/30 dark:border-gray-800 soft-shadow">
            <div 
              className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('${featuredProduct?.image ? getImageUrl(featuredProduct.image) : burgerImage}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-xs text-amber-400 icon-fill">star</span>
                <span className="text-xs text-amber-400 font-semibold">{featuredProduct?.rating || '4.9'}</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-white line-clamp-1">{featuredProduct?.name || 'Truffle Wagyu Burger'}</h3>
              <p className="font-body-sm text-body-sm text-gray-300 line-clamp-1">{featuredProduct?.description || 'Premium wagyu, black truffle aioli'}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-label-md text-label-md text-white font-bold">₹{featuredProduct?.price || '24'}</span>
                <Link to="/#menu-section" className="bg-white/20 backdrop-blur-sm text-white font-label-sm text-label-sm px-3 py-1 rounded-lg hover:bg-white/30 transition-colors">
                  Order Now
                </Link>
              </div>
            </div>
          </div>

          {/* ── Widget 2 (1x1): Cart Summary ── */}
          <Link to="/cart" className="col-span-1 row-span-1 rounded-2xl bg-surface-container-lowest dark:bg-[#121414] border border-outline-variant/30 dark:border-gray-800 soft-shadow p-4 flex flex-col hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[#F97316] icon-fill text-xl">shopping_cart</span>
              {totalQty > 0 && (
                <span className="bg-[#F97316] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Cart</p>
            <p className="font-headline-md text-headline-md text-primary dark:text-white mt-auto">
              {totalQty > 0 ? `₹${subtotal}` : 'Empty'}
            </p>
            {cartItems?.length > 0 && (
              <div className="flex -space-x-2 mt-1 overflow-hidden">
                {cartItems.slice(0, 3).map((item, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-surface-container-lowest dark:border-[#121414] overflow-hidden bg-surface-container dark:bg-gray-800">
                    <img 
                      src={item.image ? (typeof item.image === 'string' ? getImageUrl(item.image) : item.image) : defaultFoodImage} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <div className="w-6 h-6 rounded-full border-2 border-surface-container-lowest dark:border-[#121414] bg-surface-container dark:bg-gray-800 flex items-center justify-center text-[9px] font-bold text-on-surface-variant dark:text-gray-400">
                    +{cartItems.length - 3}
                  </div>
                )}
              </div>
            )}
          </Link>

          {/* ── Widget 3 (1x1): Recommended Restaurant ── */}
          <div className="col-span-1 row-span-1 rounded-2xl bg-surface-container-lowest dark:bg-[#121414] border border-outline-variant/30 dark:border-gray-800 soft-shadow p-4 flex flex-col hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden mb-2">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${restaurantImage}')` }} />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Top Pick</p>
            <p className="font-label-md text-label-md text-primary dark:text-white font-semibold line-clamp-1 mt-auto">Aura Kitchen</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-xs text-amber-400 icon-fill">star</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">4.8</span>
              <span className="text-[8px] text-on-surface-variant dark:text-gray-500">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">25-35 min</span>
            </div>
          </div>

          {/* ── Widget 4 (1x1): Recent Orders ── */}
          <Link to="/orders" className="col-span-1 sm:col-span-2 row-span-1 rounded-2xl bg-surface-container-lowest dark:bg-[#121414] border border-outline-variant/30 dark:border-gray-800 soft-shadow p-4 flex flex-col hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-primary dark:text-gray-300 text-xl">receipt_long</span>
              {recentOrders.length > 0 && role === 'customer' && (
                <span className="font-label-sm text-label-sm text-[#F97316] font-semibold">{recentOrders.length} orders</span>
              )}
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Recent Orders</p>
            {role === 'customer' && recentOrders.length > 0 ? (
              <div className="mt-auto space-y-1">
                {recentOrders.slice(0, 2).map((order, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-primary dark:text-white truncate max-w-[100px]">{order._id}</span>
                    <span className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded ${
                      order.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      order.status === 'Preparing' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    }`}>{order.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`font-label-sm text-label-sm mt-auto ${isLoggedIn ? 'text-on-surface-variant dark:text-gray-400' : 'text-gray-400'}`}>
                {isLoggedIn ? 'No orders yet' : 'Sign in to order'}
              </p>
            )}
          </Link>

          {/* ── Widget 5 (1x1): Delivery Info / Offers ── */}
          <div className="col-span-1 row-span-1 rounded-2xl bg-gradient-to-br from-[#F97316] to-orange-600 p-4 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "16px 16px" }} />
            <div className="relative z-10 flex flex-col h-full">
              <span className="material-symbols-outlined text-white text-xl mb-1">local_offer</span>
              <p className="font-label-sm text-label-sm text-orange-100">Free Delivery</p>
              <p className="font-headline-md text-headline-md text-white font-bold mt-auto">₹0</p>
              <p className="font-label-sm text-label-sm text-orange-100">On orders above ₹199</p>
            </div>
          </div>

          {/* ── Widget 6 (1x1): Quick Categories ── */}
          <Link to="/#menu-section" className="col-span-1 row-span-1 rounded-2xl bg-surface-container-lowest dark:bg-[#121414] border border-outline-variant/30 dark:border-gray-800 soft-shadow p-4 flex flex-col hover:-translate-y-0.5 transition-all duration-300 group">
            <span className="material-symbols-outlined text-primary dark:text-gray-300 text-xl mb-1">grid_view</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Categories</p>
            <div className="flex flex-wrap gap-1 mt-auto">
              {['Burger', 'Pizza', 'Drinks'].map((cat) => (
                <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400">
                  {cat}
                </span>
              ))}
            </div>
          </Link>

          {/* ── Widget 7 (1x1): ETA / Location ── */}
          <div className="col-span-1 sm:col-span-2 row-span-1 rounded-2xl bg-surface-container-lowest dark:bg-[#121414] border border-outline-variant/30 dark:border-gray-800 soft-shadow p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 dark:bg-[#F97316]/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#F97316] text-xl">motorcycle</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Delivery ETA</p>
              <p className="font-headline-md text-headline-md text-primary dark:text-white">30-45 min</p>
              <p className="font-label-sm text-label-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check_circle</span>
                Live tracking available
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Location Prompt Modal */}
      {showLocationModal && (
        <LocationPromptModal onClose={() => setShowLocationModal(false)} />
      )}
    </section>
  );
};

export default HeroDashboard;