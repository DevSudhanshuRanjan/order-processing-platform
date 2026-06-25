import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product._id);
      if (existing) {
        return prev.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { 
        productId: product._id, 
        name: product.name, 
        price: product.price, 
        image: (product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'),
        quantity 
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const increaseQuantity = (productId) => {
    setCartItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prev => prev.map(item => 
      item.productId === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 50 : 0; // Flat fee for mock
  const tax = subtotal * 0.05; // 5% mock tax
  const grandTotal = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      increaseQuantity, 
      decreaseQuantity, 
      clearCart,
      subtotal,
      deliveryFee,
      tax,
      grandTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
