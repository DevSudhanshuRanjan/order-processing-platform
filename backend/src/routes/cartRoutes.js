import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
  switchVendorAndAdd,
} from "../controllers/cartController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  addToCartValidator,
  updateCartValidator,
  removeItemValidator,
} from "../validators/cartValidator.js";

const router = express.Router();

// All cart routes require a logged-in user with a 'customer' role
router.post(
  "/add",
  authMiddleware,
  roleMiddleware("customer"),
  addToCartValidator,
  addToCart
);

router.post(
  "/switch-vendor",
  authMiddleware,
  roleMiddleware("customer"),
  addToCartValidator,
  switchVendorAndAdd
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("customer"),
  getCart
);

router.patch(
  "/update",
  authMiddleware,
  roleMiddleware("customer"),
  updateCartValidator,
  updateCart
);

router.delete(
  "/remove/:productId",
  authMiddleware,
  roleMiddleware("customer"),
  removeItemValidator,
  removeCartItem
);

export default router;
