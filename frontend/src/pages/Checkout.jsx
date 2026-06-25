import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCart } from '../contexts/CartContext';
import { useLocation, DELI_ZONE_POLYGON } from '../contexts/LocationContext';
import { placeOrder } from '../services/orderService';
import toast from 'react-hot-toast';

// Fix for default marker icon in leaflet with react
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const schema = z.object({
  fullName: z.string().min(3, { message: 'Full name is required' }),
  phone: z.string().min(10, { message: 'Valid phone number required' }),
  house: z.string().min(1, { message: 'House/Flat info is required' }),
  street: z.string().min(1, { message: 'Street info is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  pincode: z.string().min(6, { message: 'Valid pincode required' }),
});

// Component to handle map clicks for selecting location
const LocationMarker = ({ position, setPosition, checkServiceability }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      checkServiceability(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, grandTotal, subtotal, deliveryFee, tax, clearCart } = useCart();
  const { serviceable, checkServiceability, updateLocationFromPincode } = useLocation();
  const [position, setPosition] = useState(null); // Default location null
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema)
  });

  const pincodeValue = watch("pincode");

  useEffect(() => {
    if (pincodeValue && pincodeValue.length === 6) {
      updateLocationFromPincode(pincodeValue).then((res) => {
        if (res.success) {
          setPosition([res.lat, res.lng]);
        }
      });
    }
  }, [pincodeValue]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    // Set a default center near Delhi Zone for the map view
    if (!position) {
      setPosition([28.61, 77.22]);
      checkServiceability(28.61, 77.22);
    }
  }, [cartItems, navigate, checkServiceability]);

  const onSubmit = async (data) => {
    if (!position) {
      toast.error('Please select a delivery location on the map');
      return;
    }
    if (!serviceable) {
      toast.error('Selected location is outside our delivery zone');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        address: data,
        location: { latitude: position[0], longitude: position[1] },
        items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity }))
      };
      const res = await placeOrder(orderData);
      if (res.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/order-success');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-[#1a1c1c] text-on-surface dark:text-white min-h-screen">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pt-32 min-h-screen">
        <header className="mb-stack-lg text-center md:text-left">
          <Link className="inline-flex items-center gap-2 text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors mb-stack-sm font-label-md text-label-md" to="/cart">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Cart
          </Link>
          <h1 className="font-headline-xl text-headline-xl text-primary dark:text-white">Checkout</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          
          {/* Left Column: Form & Map */}
          <div className="lg:col-span-7 flex flex-col gap-stack-lg">
            
            {/* Map Section */}
            <section className="bg-surface-container-lowest dark:bg-[#121414] rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-outline-variant/30 dark:border-gray-800">
              <h2 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-stack-md flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">location_on</span>
                Delivery Details
              </h2>
              <p className="text-sm text-on-surface-variant dark:text-gray-400 mb-4">
                Click on the map to set your exact delivery location. We only deliver within the highlighted zone.
              </p>
              <div className="w-full h-64 rounded-xl bg-surface-container dark:bg-gray-800 mb-stack-md overflow-hidden relative border border-outline-variant/30 dark:border-gray-700 z-0">
                {position && (
                  <MapContainer center={[28.61, 77.22]} zoom={12} scrollWheelZoom={true} className="h-full w-full">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Polygon positions={DELI_ZONE_POLYGON} pathOptions={{ color: '#F97316', fillColor: '#F97316', fillOpacity: 0.2 }} />
                    <LocationMarker position={position} setPosition={setPosition} checkServiceability={checkServiceability} />
                    <MapUpdater center={position} />
                  </MapContainer>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 mb-stack-md">
                {serviceable ? (
                  <span className="bg-green-500/10 text-green-600 dark:text-green-400 font-label-md text-label-md px-4 py-2 rounded-full shadow-md flex items-center gap-2 border border-green-500/20">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Location is serviceable
                  </span>
                ) : (
                  <span className="bg-red-500/10 text-red-600 dark:text-red-400 font-label-md text-label-md px-4 py-2 rounded-full shadow-md flex items-center gap-2 border border-red-500/20">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    Location is outside our delivery zone.
                  </span>
                )}
              </div>

              {/* Address Form */}
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                <div className="md:col-span-2">
                  <label className="block font-label-md text-on-surface dark:text-gray-300 mb-2" htmlFor="fullName">Full Name</label>
                  <input {...register("fullName")} className="block w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-gray-700 bg-transparent text-on-surface dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md" id="fullName" placeholder="Full Name" type="text" />
                  {errors.fullName && <span className="text-error text-xs mt-1 block">{errors.fullName.message}</span>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block font-label-md text-on-surface dark:text-gray-300 mb-2" htmlFor="phone">Phone Number</label>
                  <input {...register("phone")} className="block w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-gray-700 bg-transparent text-on-surface dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md" id="phone" placeholder="Phone Number" type="text" />
                  {errors.phone && <span className="text-error text-xs mt-1 block">{errors.phone.message}</span>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block font-label-md text-on-surface dark:text-gray-300 mb-2" htmlFor="house">House / Flat No.</label>
                  <input {...register("house")} className="block w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-gray-700 bg-transparent text-on-surface dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md" id="house" placeholder="House / Flat No." type="text" />
                  {errors.house && <span className="text-error text-xs mt-1 block">{errors.house.message}</span>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block font-label-md text-on-surface dark:text-gray-300 mb-2" htmlFor="street">Street / Area</label>
                  <input {...register("street")} className="block w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-gray-700 bg-transparent text-on-surface dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md" id="street" placeholder="Street / Area" type="text" />
                  {errors.street && <span className="text-error text-xs mt-1 block">{errors.street.message}</span>}
                </div>

                <div>
                  <label className="block font-label-md text-on-surface dark:text-gray-300 mb-2" htmlFor="city">City</label>
                  <input {...register("city")} className="block w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-gray-700 bg-transparent text-on-surface dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md" id="city" placeholder="City" type="text" />
                  {errors.city && <span className="text-error text-xs mt-1 block">{errors.city.message}</span>}
                </div>
                
                <div>
                  <label className="block font-label-md text-on-surface dark:text-gray-300 mb-2" htmlFor="state">State</label>
                  <input {...register("state")} className="block w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-gray-700 bg-transparent text-on-surface dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md" id="state" placeholder="State" type="text" />
                  {errors.state && <span className="text-error text-xs mt-1 block">{errors.state.message}</span>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block font-label-md text-on-surface dark:text-gray-300 mb-2" htmlFor="pincode">Pincode</label>
                  <input {...register("pincode")} className="block w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-gray-700 bg-transparent text-on-surface dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md" id="pincode" placeholder="Pincode" type="text" />
                  {errors.pincode && <span className="text-error text-xs mt-1 block">{errors.pincode.message}</span>}
                </div>
              </form>
            </section>
            
            {/* Payment Method Section (Visual Only for now) */}
            <section className="bg-surface-container-lowest dark:bg-[#121414] rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-outline-variant/30 dark:border-gray-800">
              <h2 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-stack-md flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">credit_card</span>
                Payment
              </h2>
              <div className="flex gap-4 mb-stack-md">
                <label className="flex-1 cursor-pointer relative">
                  <input defaultChecked className="peer sr-only" name="payment" type="radio" />
                  <div className="h-full border-2 border-outline-variant/50 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 peer-checked:border-primary peer-checked:bg-surface-container dark:peer-checked:bg-gray-800 transition-all">
                    <span className="material-symbols-outlined text-[32px] text-primary dark:text-white">credit_card</span>
                    <span className="font-label-sm text-label-sm text-primary dark:text-white">Card / Cash on Delivery</span>
                  </div>
                </label>
              </div>
            </section>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 bg-surface-container-lowest/70 dark:bg-[#121414]/70 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-outline-variant/50 dark:border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
              <h3 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-stack-md">Final Order</h3>
              
              <div className="space-y-4 mb-stack-md font-body-md text-body-md">
                {cartItems.map((item, index) => (
                  <div key={item.productId} className={`flex justify-between items-center text-sm ${index > 0 ? 'border-t border-outline-variant/20 dark:border-gray-800 pt-4' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded">{item.quantity}x</span>
                      <span className="font-medium text-on-surface dark:text-gray-200">{item.name}</span>
                    </div>
                    <span className="font-semibold text-on-surface-variant dark:text-gray-300">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline-variant/30 dark:border-gray-800 pt-4 mb-stack-md space-y-4">
                <div className="flex justify-between text-on-surface-variant dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-primary dark:text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-primary dark:text-white">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant dark:text-gray-400">
                  <span>Taxes</span>
                  <span className="font-medium text-primary dark:text-white">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 dark:border-gray-800 pt-4 mb-stack-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-headline-xl text-headline-xl text-primary dark:text-white">Total to Pay</span>
                  <span className="font-headline-xl text-headline-xl text-primary dark:text-white">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={loading || !serviceable}
                className={`w-full py-4 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 relative overflow-hidden group transition-transform duration-200 ${
                  !serviceable 
                    ? 'bg-surface-container text-on-surface-variant cursor-not-allowed' 
                    : 'bg-primary text-on-primary hover:-translate-y-[2px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  ) : (
                    <>
                      Confirm Order
                      <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </>
                  )}
                </span>
                {!loading && serviceable && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
                )}
              </button>
              <p className="text-center font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 mt-4">
                  By placing your order, you agree to our Terms of Service.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Checkout;
