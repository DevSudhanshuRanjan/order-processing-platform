import express from "express";
import rateLimit from "express-rate-limit";

import {
  register,
  login,
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too Many Attempts",
    });
  },
});

router.post(
  "/register",
  registerValidator,
  register
);

router.post(
  "/login",
  loginLimiter,
  loginValidator,
  login
);

export default router;