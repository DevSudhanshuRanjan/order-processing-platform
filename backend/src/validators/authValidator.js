import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/(?=.*[a-z])/)
    .withMessage("Password must contain lowercase letter")
    .matches(/(?=.*[A-Z])/)
    .withMessage("Password must contain uppercase letter")
    .matches(/(?=.*\d)/)
    .withMessage("Password must contain number"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];