import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { role } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await API.get("/cart");
      if (res.data && res.data.success) {
        setCartItems(res.data.items);
        localStorage.setItem("cart", JSON.stringify(res.data.items));
      }
    } catch (error) {
      console.error("Error fetching database cart:", error);
      const storedCart = localStorage.getItem("cart");
      if (storedCart) setCartItems(JSON.parse(storedCart));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "customer") {
      fetchCart();
    }
  }, [role]);

  const addToCart = async (product, quantity = 1) => {
    if (role !== "customer") {
      console.warn("Only customers can add items to cart");
      return;
    }
    try {
      const existing = cartItems.find((item) => item.productId === product._id);
      const targetQty = existing ? existing.quantity + quantity : quantity;

      const res = await API.post("/cart/add", {
        productId: product._id,
        quantity: targetQty,
      });

      if (res.data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (role !== "customer") {
      console.warn("Only customers can remove items from cart");
      return;
    }
    try {
      const res = await API.delete(`/cart/remove/${productId}`);
      if (res.data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const increaseQuantity = async (productId) => {
    if (role !== "customer") {
      console.warn("Only customers can update cart quantity");
      return;
    }
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;

    if (item.stock && item.quantity >= item.stock) {
      console.warn("Maximum Quantity Reached");
      return;
    }

    try {
      const res = await API.patch("/cart/update", {
        productId,
        quantity: item.quantity + 1,
      });

      if (res.data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const decreaseQuantity = async (productId) => {
    if (role !== "customer") {
      console.warn("Only customers can update cart quantity");
      return;
    }
    const item = cartItems.find((i) => i.productId === productId);
    if (!item || item.quantity <= 1) return;

    try {
      const res = await API.patch("/cart/update", {
        productId,
        quantity: item.quantity - 1,
      });

      if (res.data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = () => {
    if (role !== "customer") {
      console.warn("Only customers can clear cart");
      return;
    }
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        fetchCart,
        subtotal,
        deliveryFee,
        tax,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
