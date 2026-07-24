import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  rateProduct,
  getTopRated,
} from "../controllers/productController.js";

import {
  createProductValidator,
  updateProductValidator,
} from "../validators/productValidator.js";

const router = express.Router();

/*
PUBLIC
*/

router.get(
  "/products",
  getProducts
);

router.get(
  "/products/:id",
  getProductById
);

/*
CUSTOMER - Rating
*/

router.post(
  "/products/:id/rate",
  authMiddleware,
  roleMiddleware("customer"),
  rateProduct
);

/*
PUBLIC - Top Rated
*/

router.get(
  "/products/top-rated",
  getTopRated
);

/*
VENDOR
*/

router.get(
  "/vendor/products",
  authMiddleware,
  roleMiddleware("vendor"),
  getVendorProducts
);

router.post(
  "/vendor/products",
  authMiddleware,
  roleMiddleware("vendor"),
  createProductValidator,
  createProduct
);

router.patch(
  "/vendor/products/:id",
  authMiddleware,
  roleMiddleware("vendor"),
  updateProductValidator,
  updateProduct
);

router.delete(
  "/vendor/products/:id",
  authMiddleware,
  roleMiddleware("vendor"),
  deleteProduct
);

export default router;