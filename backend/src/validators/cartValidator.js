import { body, param } from "express-validator";

export const addToCartValidator = [
  body("productId")
    .isMongoId()
    .withMessage("Invalid Product ID"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0"),
];

export const updateCartValidator = [
  body("productId")
    .isMongoId()
    .withMessage("Invalid Product ID"),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0"),
];

export const removeItemValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid Product ID"),
];