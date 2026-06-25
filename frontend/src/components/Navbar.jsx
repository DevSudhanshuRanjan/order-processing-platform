import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { isLoggedIn, role, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 mx-auto transition-all duration-300 ${scrolled ? 'bg-surface/80 dark:bg-[#121414]/80 shadow-sm dark:shadow-none dark:border-b dark:border-outline-variant/10 backdrop-blur-xl' : 'bg-transparent'}`} id="main-nav">
      {/* Brand Logo */}
      <Link to="/" className="font-headline-lg text-headline-lg-mobile md:text-headline-lg tracking-tighter text-primary dark:text-white">Aura Eats</Link>
      
      {/* Navigation Links (Web) */}
      <ul className="hidden md:flex items-center gap-gutter">
        <li>
          <Link to="/" className={`${isActive('/') ? 'text-primary dark:text-white font-bold border-b-2 border-primary dark:border-white pb-1 scale-95' : 'text-on-surface-variant dark:text-gray-300 font-medium'} font-label-md text-label-md transition-transform hover:text-primary dark:hover:text-white transition-colors duration-300`}>Home</Link>
        </li>
        <li>
          <Link to="/products" className={`${isActive('/products') ? 'text-primary dark:text-white font-bold border-b-2 border-primary dark:border-white pb-1 scale-95' : 'text-on-surface-variant dark:text-gray-300 font-medium'} font-label-md text-label-md transition-transform hover:text-primary dark:hover:text-white transition-colors duration-300`}>Menu</Link>
        </li>
        {role === 'customer' && (
          <li>
            <Link to="/orders" className={`${isActive('/orders') ? 'text-primary dark:text-white font-bold border-b-2 border-primary dark:border-white pb-1 scale-95' : 'text-on-surface-variant dark:text-gray-300 font-medium'} font-label-md text-label-md transition-transform hover:text-primary dark:hover:text-white transition-colors duration-300`}>Orders</Link>
          </li>
        )}
        {isLoggedIn && role === 'vendor' && (
          <li>
            <Link to="/vendor" className={`${isActive('/vendor') ? 'text-primary dark:text-white font-bold border-b-2 border-primary dark:border-white pb-1 scale-95' : 'text-on-surface-variant dark:text-gray-300 font-medium'} font-label-md text-label-md transition-transform hover:text-primary dark:hover:text-white transition-colors duration-300`}>Dashboard</Link>
          </li>
        )}
        {isLoggedIn && role === 'admin' && (
          <li>
            <Link to="/admin" className={`${isActive('/admin') ? 'text-primary dark:text-white font-bold border-b-2 border-primary dark:border-white pb-1 scale-95' : 'text-on-surface-variant dark:text-gray-300 font-medium'} font-label-md text-label-md transition-transform hover:text-primary dark:hover:text-white transition-colors duration-300`}>Dashboard</Link>
          </li>
        )}
      </ul>

      {/* Trailing Actions */}
      <div className="flex items-center gap-stack-sm">
        <ThemeToggle />
        
        {role === 'customer' && (
          <Link to="/cart" aria-label="shopping_cart" className="relative p-2 text-on-surface-variant dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined icon-fill">shopping_cart</span>
            {totalCartItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#F97316] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>
        )}

        {!isLoggedIn ? (
          <div className="flex items-center gap-2 ml-2">
            <Link to="/login" className="text-on-surface-variant dark:text-gray-300 font-label-md text-label-md hover:text-primary dark:hover:text-white transition-colors">Sign in</Link>
            <Link to="/register" className="bg-[#F97316] text-on-primary font-label-md text-label-md px-4 py-2 rounded-xl hover:scale-105 transition-transform duration-300 hidden sm:block">Sign up</Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-2">
            <Link to="/profile" aria-label="profile" className="p-2 text-on-surface-variant dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors duration-300" title="Profile">
              <span className="material-symbols-outlined icon-fill">account_circle</span>
            </Link>
            <button onClick={logout} aria-label="logout" className="p-2 text-on-surface-variant dark:text-gray-300 hover:text-error transition-colors duration-300" title="Logout">
              <span className="material-symbols-outlined icon-fill">logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
