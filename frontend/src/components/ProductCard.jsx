import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (role !== 'customer') {
      toast.error('Only customers can place orders');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };



  const navigateToDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <article 
      onClick={navigateToDetails}
      className="bg-surface-container-lowest dark:bg-[#121414] rounded-2xl border border-outline-variant/30 dark:border-gray-800 overflow-hidden product-card-hover transition-all duration-300 flex flex-col group cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden bg-surface-container-low dark:bg-[#1a1c1c]">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
          src={(product.images && product.images.length > 0) ? product.images[0] : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'} 
          alt={product.name} 
          loading="lazy"
        />

      </div>
      <div className="p-stack-md flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-stack-sm gap-2">
          <h3 className="font-headline-lg text-headline-lg text-primary dark:text-white line-clamp-1">{product.name}</h3>
          <span className="font-headline-lg text-headline-lg text-on-surface-variant dark:text-gray-300 flex-shrink-0">₹{product.price}</span>
        </div>
        <p className="text-on-surface-variant dark:text-gray-400 font-body-md text-body-md line-clamp-2 mb-stack-md flex-grow">
          {product.description}
        </p>
        <div className="flex gap-2 mt-auto">
          <button 
            onClick={handleAddToCart}
            className="w-full py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-colors bg-primary text-on-primary group-hover:bg-inverse-surface dark:group-hover:bg-[#2f3131]"
          >
            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            Add to Order
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
