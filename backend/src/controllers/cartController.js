import { validationResult } from "express-validator";
import {
  addItem,
  getUserCart,
  updateQuantity,
  removeItem,
  switchVendor,
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

    const result = await addItem(req.user.id, productId, quantity);

    if (result.vendorConflict) {
      return res.status(409).json({
        success: false,
        message: "Vendor Conflict",
        vendorConflict: true,
        currentVendorId: result.currentVendorId,
        newVendorId: result.newVendorId,
        productId: result.productId,
        quantity: result.quantity,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Added To Cart",
    });
  } catch (error) {
    next(error);
  }
};

export const switchVendorAndAdd = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { productId, quantity = 1 } = req.body;

    await switchVendor(req.user.id, productId, quantity);

    return res.status(200).json({
      success: true,
      message: "Switched vendor and added to cart",
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getUserCart(req.user.id);

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        items: [],
        vendorAssigned: null,
      });
    }

    const items = cart.items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image || null,
        quantity: item.quantity,
        stock: item.productId.stock,
        vendorId: item.productId.vendorId,
      }));

    return res.status(200).json({
      success: true,
      items,
      vendorAssigned: cart.vendorAssigned,
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
    await removeItem(req.user.id, req.params.productId);

    return res.status(200).json({
      success: true,
      message: "Item Removed",
    });
  } catch (error) {
    next(error);
  }
};