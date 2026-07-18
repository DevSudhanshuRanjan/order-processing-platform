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

  const imageSrc =
    product.image
      ? getImageUrl(product.image)
      : product.images && product.images.length > 0
        ? (typeof product.images[0] === 'string' ? getImageUrl(product.images[0]) : product.images[0])
        : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80";

  return (
    <article
      onClick={navigateToDetails}
      className={`bg-surface-container-lowest dark:bg-[#121414] border border-outline-variant/30 dark:border-gray-800 overflow-hidden group cursor-pointer soft-shadow transition-all duration-300 flex flex-col ${
        compact
          ? 'rounded-2xl hover:-translate-y-1 hover:shadow-lg'
          : 'rounded-2xl hover:-translate-y-1 hover:shadow-lg'
      }`}
    >
      {/* Image Container with fixed aspect ratio — using bg-cover for guaranteed cropping */}
      <div className={`relative overflow-hidden bg-surface-container-low dark:bg-[#1a1c1c] ${
        compact ? 'aspect-[4/3]' : 'aspect-[4/3]'
      }`}>
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${imageSrc}')` }}
          role="img"
          aria-label={product.name}
        ></div>
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-grow ${
        compact ? 'p-4 gap-1.5' : 'p-stack-md gap-1.5'
      }`}>
        {/* Name */}
        <h3 className={`text-primary dark:text-white line-clamp-1 font-semibold ${
          compact ? 'text-[15px]' : 'font-headline-lg text-headline-lg'
        }`}>
          {product.name}
        </h3>

        {/* Description */}
        <p className={`text-on-surface-variant dark:text-gray-400 line-clamp-2 flex-grow ${
          compact ? 'text-[13px] leading-relaxed' : 'font-body-md text-body-md'
        }`}>
          {product.description}
        </p>

        {/* Price + Add Button Row */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-2">
          <span className={`text-emerald-500 dark:text-emerald-400 font-bold ${
            compact ? 'text-lg' : 'text-xl'
          }`}>
            ₹{product.price}
          </span>
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 transition-all duration-300 font-medium whitespace-nowrap ${
              compact
                ? 'px-4 py-2 rounded-xl text-[13px]'
                : 'px-5 py-2.5 rounded-xl font-label-md text-label-md'
            } bg-primary text-on-primary hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-500/20 active:scale-[0.98]`}
          >
            <span className="material-symbols-outlined text-[18px]">
              add_shopping_cart
            </span>
            Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;