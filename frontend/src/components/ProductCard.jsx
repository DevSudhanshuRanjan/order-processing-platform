import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { getImageUrl } from "../services/vendorService";
import toast from "react-hot-toast";

const ProductCard = ({ product, compact = false }) => {
  const { addToCart } = useCart();
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (role !== "customer") {
      toast.error("Only customers can place orders");
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
      className={`bg-surface-container-lowest dark:bg-[#121414] border border-outline-variant/30 dark:border-gray-800 overflow-hidden product-card-hover transition-all duration-300 flex flex-col group cursor-pointer ${
        compact ? 'rounded-xl' : 'rounded-2xl'
      }`}
    >
      <div className={`relative overflow-hidden bg-surface-container-low dark:bg-[#1a1c1c] ${
        compact ? 'h-48' : 'h-64'
      }`}>
        <img
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          src={
            product.image 
              ? getImageUrl(product.image)
              : product.images && product.images.length > 0
                ? (typeof product.images[0] === 'string' ? getImageUrl(product.images[0]) : product.images[0])
                : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
          }
          alt={product.name}
          loading="lazy"
        />
      </div>
      <div className={`flex flex-col flex-grow ${
        compact ? 'p-3 gap-1' : 'p-stack-md'
      }`}>
        <div className="flex justify-between items-start gap-2">
          <h3 className={`text-primary dark:text-white line-clamp-1 ${
            compact ? 'font-headline-md text-headline-md' : 'font-headline-lg text-headline-lg'
          }`}>
            {product.name}
          </h3>
          <span className={`text-on-surface-variant dark:text-gray-300 flex-shrink-0 ${
            compact ? 'font-headline-md text-headline-md' : 'font-headline-lg text-headline-lg'
          }`}>
            ₹{product.price}
          </span>
        </div>
        <p className={`text-on-surface-variant dark:text-gray-400 line-clamp-2 flex-grow ${
          compact ? 'font-body-sm text-body-sm mb-2' : 'font-body-md text-body-md mb-stack-md'
        }`}>
          {product.description}
        </p>
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-1 transition-colors bg-primary text-on-primary group-hover:bg-inverse-surface dark:group-hover:bg-[#2f3131] ${
              compact ? 'py-2 rounded-lg font-label-sm text-label-sm' : 'py-3 rounded-lg font-label-md text-label-md'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              add_shopping_cart
            </span>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
