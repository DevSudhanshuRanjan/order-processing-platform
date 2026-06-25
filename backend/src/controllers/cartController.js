import { validationResult } from "express-validator";
import {
  addItem,
  getUserCart,
  updateQuantity,
  removeItem,
} from "../services/cartService.js";

export const addToCart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { productId, quantity = 1 } = req.body;

    // Use req.user.id based on your authMiddleware structure
    await addItem(req.user.id, productId, quantity);

    return res.status(200).json({
      success: true,
      message: "Added To Cart",
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    // Use req.user.id based on your authMiddleware structure
    const cart = await getUserCart(req.user.id);

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        items: [],
      });
    }

    const items = cart.items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity,
        stock: item.productId.stock,
      }));

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { productId, quantity } = req.body;

    // Use req.user.id based on your authMiddleware structure
    await updateQuantity(req.user.id, productId, quantity);

    return res.status(200).json({
      success: true,
      message: "Cart Updated",
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    // Use req.user.id based on your authMiddleware structure
    await removeItem(req.user.id, req.params.productId);

    return res.status(200).json({
      success: true,
      message: "Item Removed",
    });
  } catch (error) {
    next(error);
  }
};
