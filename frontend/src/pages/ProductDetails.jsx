import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn, role } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
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



  return (
    <div className="bg-background dark:bg-[#1a1c1c] text-on-background dark:text-white min-h-screen transition-colors duration-300">
      <main className="pt-[100px] pb-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Breadcrumb */}
        <div className="py-stack-sm flex items-center gap-2 text-on-surface-variant dark:text-gray-400 font-label-sm text-label-sm mb-stack-md">
          <Link className="hover:text-primary dark:hover:text-white transition-colors" to="/products">Menu</Link>
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
            
            {/* Thumbnails */}
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
          </div>

          {/* Right: Sticky Info Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-surface-container-lowest dark:bg-[#121414] rounded-2xl p-stack-md border border-surface-variant dark:border-gray-800 stagger-slide-up shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
              <div className="flex justify-between items-start mb-stack-sm">
                <h1 className="font-headline-xl text-headline-xl text-primary dark:text-white pr-4">{product.name}</h1>
                <span className="font-headline-lg text-headline-lg text-primary dark:text-white">₹{product.price}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-stack-md">
                <div className="flex text-[#F59E0B]">
                  <span className="material-symbols-outlined filled" style={{ fontSize: '20px' }}>star</span>
                  <span className="material-symbols-outlined filled" style={{ fontSize: '20px' }}>star</span>
                  <span className="material-symbols-outlined filled" style={{ fontSize: '20px' }}>star</span>
                  <span className="material-symbols-outlined filled" style={{ fontSize: '20px' }}>star</span>
                  <span className="material-symbols-outlined filled" style={{ fontSize: '20px' }}>star_half</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant dark:text-gray-400">4.9</span>
              </div>
              
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300 mb-stack-lg leading-relaxed">
                {product.description}
              </p>

              {/* Quantity & Actions */}
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
    </div>
  );
};

export default ProductDetails;
