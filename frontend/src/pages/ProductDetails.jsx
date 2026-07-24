import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, rateProduct } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import RatingStars from '../components/RatingStars';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn, role } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vendorName, setVendorName] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [pendingRating, setPendingRating] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        if (data.vendorId && typeof data.vendorId === 'object') {
          setVendorName(data.vendorId.name);
          setVendorId(data.vendorId._id);
        } else if (data.vendorId) {
          setVendorId(data.vendorId);
        }
      } catch (error) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-10 max-w-container-max min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (role !== 'customer') {
      toast.error('Only customers can place orders');
      return;
    }
    addToCart(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  const handleStarClick = (rating) => {
    if (!isLoggedIn || role !== 'customer') {
      toast.error('Please login to rate');
      return;
    }
    setPendingRating(rating);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const existing = product.ratings?.find(r => r.userName === userData?.name);
    setComment(existing?.comment || '');
    setShowCommentModal(true);
  };

  const submitRating = async () => {
    if (!pendingRating) return;
    setSubmitting(true);
    try {
      const result = await rateProduct(product._id, pendingRating, comment);
      setProduct(prev => ({
        ...prev,
        averageRating: result.averageRating,
        numberOfRatings: result.numberOfRatings,
      }));
      toast.success('Thank you for your rating!');
      setShowCommentModal(false);
      setPendingRating(null);
      setComment('');
    } catch {
      toast.error('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background dark:bg-[#1a1c1c] text-on-background dark:text-white min-h-screen transition-colors duration-300">
      <main className="pt-[100px] pb-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Breadcrumb */}
        <div className="py-stack-sm flex items-center gap-2 text-on-surface-variant dark:text-gray-400 font-label-sm text-label-sm mb-stack-md">
          <Link className="hover:text-primary dark:hover:text-white transition-colors" to="/">Home</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
          <Link className="hover:text-primary dark:hover:text-white transition-colors" to={`/products?category=${product.category}`}>{product.category}</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
          <span className="text-primary dark:text-white">{product.name}</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter relative">
          
          {/* Left: Image */}
          <div className="lg:col-span-7 flex flex-col gap-stack-sm">
            <div className="image-zoom-container bg-surface-container-highest dark:bg-gray-800 w-full rounded-2xl relative group overflow-hidden max-h-[500px] flex items-center justify-center">
              <img 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                src={(product.images && product.images.length > 0) ? product.images[currentImageIndex] : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'} 
                alt={product.name} 
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-primary opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Reviews Section */}
            {product.ratings && product.ratings.length > 0 && (
              <div className="bg-surface-container-lowest dark:bg-[#121414] rounded-2xl p-stack-md border border-surface-variant dark:border-gray-800 transition-colors duration-300">
                <h3 className="font-headline-md text-headline-md text-primary dark:text-white mb-stack-sm">
                  Reviews ({product.numberOfRatings})
                </h3>
                <div className="flex flex-col gap-stack-sm max-h-[400px] overflow-y-auto hide-scrollbar">
                  {product.ratings.slice().reverse().map((r, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container dark:bg-[#1a1c1c] border border-outline-variant/20 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-[#F97316]">
                              {r.userName?.charAt(0).toUpperCase() || 'A'}
                            </span>
                          </div>
                          <span className="font-label-sm text-label-sm text-primary dark:text-white">{r.userName}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(star => (
                            <span key={star} className={`material-symbols-outlined text-xs ${star <= r.rating ? 'text-[#F59E0B]' : 'text-gray-400'}`}
                              style={{ fontSize: '14px', fontVariationSettings: star <= r.rating ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-400 mt-1">{r.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sticky Info Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-surface-container-lowest dark:bg-[#121414] rounded-2xl p-stack-md border border-surface-variant dark:border-gray-800 stagger-slide-up shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
              <div className="flex justify-between items-start mb-stack-sm">
                <h1 className="font-headline-xl text-headline-xl text-primary dark:text-white pr-4">{product.name}</h1>
                <span className="font-headline-lg text-headline-lg text-primary dark:text-white">₹{product.price}</span>
              </div>
              
              {vendorName && vendorId && (
                <Link
                  to={`/restaurant/${vendorId}`}
                  className="inline-flex items-center gap-2 text-on-surface-variant dark:text-gray-400 hover:text-[#F97316] dark:hover:text-[#F97316] transition-colors font-label-sm text-label-sm mb-3"
                >
                  <span className="material-symbols-outlined text-[16px]">store</span>
                  View full menu from {vendorName}
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </Link>
              )}
              
              <div className="flex items-center gap-2 mb-stack-md">
                <RatingStars
                  rating={product.averageRating || 0}
                  count={product.numberOfRatings || 0}
                  size="medium"
                  onRate={handleStarClick}
                />
              </div>
              
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300 mb-stack-lg leading-relaxed">
                {product.description}
              </p>

              <div className="flex flex-col gap-stack-sm mt-stack-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-outline-variant dark:border-gray-700 rounded-xl overflow-hidden h-12 w-32 bg-surface-container-lowest dark:bg-[#1a1c1c]">
                    <button 
                      className="flex-1 flex items-center justify-center hover:bg-surface-container dark:hover:bg-gray-800 transition-colors text-on-surface-variant dark:text-gray-300 disabled:opacity-50" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="flex-1 text-center font-label-md text-label-md text-primary dark:text-white">
                      {quantity}
                    </span>
                    <button 
                      className="flex-1 flex items-center justify-center hover:bg-surface-container dark:hover:bg-gray-800 transition-colors text-on-surface-variant dark:text-gray-300 disabled:opacity-50" 
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={false}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 h-12 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 transition-transform hover:-translate-y-[2px] bg-[#F97316] text-white hover:bg-[#F97316]/90 shadow-md shadow-[#F97316]/20"
                  >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Add to Cart
                  </button>
                </div>
              </div>
              
              <div className="mt-stack-md flex items-center justify-center gap-2 text-on-surface-variant dark:text-gray-400 font-label-sm text-label-sm">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>local_shipping</span>
                <span>Estimated delivery: 25-35 mins</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rating Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest dark:bg-[#121414] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-outline-variant/30 dark:border-gray-800">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-primary dark:text-white">Rate this product</h3>
                <button onClick={() => { setShowCommentModal(false); setPendingRating(null); setComment(''); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container dark:hover:bg-gray-800 transition-colors text-on-surface-variant dark:text-gray-400">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Stars display */}
              <div className="flex items-center justify-center gap-1 py-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star}
                    className={`material-symbols-outlined text-3xl cursor-pointer transition-all hover:scale-110 ${star <= pendingRating ? 'text-[#F59E0B]' : 'text-gray-400'}`}
                    style={{ fontVariationSettings: star <= pendingRating ? "'FILL' 1" : "'FILL' 0" }}
                    onClick={() => setPendingRating(star)}
                  >
                    star
                  </span>
                ))}
              </div>

              <p className="text-center text-sm text-on-surface-variant dark:text-gray-400 -mt-1">
                {pendingRating === 1 ? 'Poor' : pendingRating === 2 ? 'Fair' : pendingRating === 3 ? 'Good' : pendingRating === 4 ? 'Very Good' : pendingRating === 5 ? 'Excellent' : ''}
              </p>

              {/* Comment input */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (optional)..."
                maxLength={300}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-surface-container dark:bg-[#1a1c1c] border border-outline-variant/50 dark:border-gray-700 focus:ring-2 focus:ring-[#F97316] outline-none font-body-sm text-body-sm text-on-background dark:text-white placeholder:text-on-surface-variant dark:placeholder:text-gray-500 transition-all resize-none"
              />
              <div className="text-right text-xs text-on-surface-variant dark:text-gray-500">{comment.length}/300</div>

              <button
                onClick={submitRating}
                disabled={submitting}
                className="w-full py-3 rounded-xl font-label-md text-label-md bg-[#F97316] text-white hover:bg-[#F97316]/90 disabled:opacity-50 transition-colors shadow-md shadow-[#F97316]/20 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    Submit Rating
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;