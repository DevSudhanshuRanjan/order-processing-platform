import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";

export const addItem = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product Not Found", 404);
  }

  if (product.status !== "active" || product.stock <= 0) {
    throw new AppError("Product Not Available", 404);
  }
  if (quantity > product.stock) {
    throw new Error("Quantity Exceeds Available Stock");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [
        {
          productId,
          quantity,
        },
      ],
    });

    return cart;
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId.toString(),
  );

  if (existingItem) {
    if (existingItem.quantity + quantity > product.stock) {
      throw new Error("Quantity Exceeds Available Stock");
    }
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
    });
  }

  await cart.save();

  return cart;
};

export const getUserCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "name price image stock",
  });

  return cart;
};

export const updateQuantity = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product Not Found", 404);
  }

  if (quantity > product.stock) {
    throw new AppError("Quantity Exceeds Available Stock", 400);
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new AppError("Cart Not Found", 404);
  }

  const item = cart.items.find(
    (item) => item.productId.toString() === productId,
  );

  if (!item) {
    throw new AppError("Product Not Found", 404);
  }

  item.quantity = quantity;

  await cart.save();

  return cart;
};

export const removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new AppError("Cart Not Found", 404);
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  await cart.save();

  return cart;
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return;
  }

  cart.items = [];

  await cart.save();
};

export const calculateTotal = (cart) => {
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0,
  );

  const deliveryFee = 40;

  const tax = subtotal * 0.05;

  const grandTotal = subtotal + deliveryFee + tax;

  return {
    subtotal,
    deliveryFee,
    tax,
    grandTotal,
  };
};
