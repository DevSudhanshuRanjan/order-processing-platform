import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { 
    cartItems, 
    increaseQuantity, 
    decreaseQuantity, 
    removeFromCart,
    subtotal,
    deliveryFee,
    tax,
    grandTotal
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-background dark:bg-[#1a1c1c] text-on-background dark:text-white min-h-screen pt-32 pb-margin-desktop flex flex-col items-center justify-center text-center px-gutter">
        <div className="w-24 h-24 bg-surface-container dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant dark:text-gray-400">shopping_cart</span>
        </div>
        <h2 className="font-headline-xl text-headline-xl text-primary dark:text-white mb-4">Your cart is empty</h2>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mb-8 max-w-md">
          Looks like you haven't added any premium dishes to your cart yet.
        </p>
        <Link to="/products" className="px-8 py-4 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:-translate-y-[2px] transition-transform shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-[#1a1c1c] text-on-background dark:text-white min-h-screen">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-lg">
        <header className="mb-stack-lg text-center md:text-left">
          <Link className="inline-flex items-center gap-2 text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors mb-stack-sm font-label-md text-label-md" to="/products">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Continue Shopping
          </Link>
          <h1 className="font-headline-xl text-headline-xl text-primary dark:text-white">Your Cart</h1>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          
          {/* Cart Items */}
          <div className="lg:col-span-7 flex flex-col gap-stack-lg">
            <section className="bg-surface-container-lowest dark:bg-[#121414] rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-outline-variant/30 dark:border-gray-800">
              <h2 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-stack-md flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">shopping_bag</span>
                Your Order
              </h2>
              <div className="flex flex-col gap-stack-sm">
                {cartItems.map((item, index) => (
                  <div key={item.productId} className={`flex items-center gap-4 p-4 hover:bg-surface-container-low dark:hover:bg-[#1a1c1c] transition-colors rounded-xl group ${index > 0 ? 'border-t border-outline-variant/20 dark:border-gray-800' : ''}`}>
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-surface-container dark:bg-gray-800">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-label-md text-label-md text-primary dark:text-white mb-1">{item.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mb-2">₹{item.price}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-surface-container dark:bg-gray-800 rounded-lg border border-outline-variant/50 dark:border-gray-700 overflow-hidden">
                          <button 
                            onClick={() => decreaseQuantity(item.productId)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-highest dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="w-8 text-center font-label-sm text-label-sm">{item.quantity}</span>
                          <button 
                            onClick={() => increaseQuantity(item.productId)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-highest dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="text-error dark:text-red-400 hover:text-on-error-container p-2 rounded-full hover:bg-error-container/20 dark:hover:bg-red-900/20 transition-colors ml-auto"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-label-md text-label-md text-primary dark:text-white">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 bg-surface-container-lowest/70 dark:bg-[#121414]/70 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-outline-variant/50 dark:border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
              <h3 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-stack-md">Order Summary</h3>
              
              <div className="space-y-4 mb-stack-md font-body-md text-body-md">
                <div className="flex justify-between text-on-surface-variant dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-primary dark:text-white font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="text-primary dark:text-white font-medium">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant dark:text-gray-400">
                  <span>Taxes &amp; Fees</span>
                  <span className="text-primary dark:text-white font-medium">₹{tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-outline-variant/30 dark:border-gray-800 pt-4 mb-stack-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-headline-xl text-headline-xl text-primary dark:text-white">Total</span>
                  <span className="font-headline-xl text-headline-xl text-primary dark:text-white">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 relative overflow-hidden group transition-transform hover:-translate-y-[2px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Proceed to Checkout
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Cart;
