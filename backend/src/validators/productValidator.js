import { body } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 }),

  body("description")
    .isLength({ min: 1, max: 500 }),

  body("price")
    .isFloat({ min: 0 }),

  body("category")
    .isIn([
      "Burger",
      "Pizza",
      "Drinks",
      "Dessert",
      "Chinese",
    ]),

  body("images")
    .isArray({ min: 1 })
    .withMessage("Images must be an array of at least 1 image"),
  body("images.*")
    .isURL()
    .withMessage("Each image must be a valid URL"),

  body("stock")
    .isInt({ min: 0 }),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }),

  body("description")
    .optional()
    .isLength({ max: 500 }),

  body("price")
    .optional()
    .isFloat({ min: 0 }),

  body("category")
    .optional()
    .isIn([
      "Burger",
      "Pizza",
      "Drinks",
      "Dessert",
      "Chinese",
    ]),

  body("images")
    .optional()
    .isArray({ min: 1 }),
  body("images.*")
    .optional()
    .isURL(),

  body("stock")
    .optional()
    .isInt({ min: 0 }),

  body("status")
    .optional()
    .isIn(["active", "inactive"]),
];