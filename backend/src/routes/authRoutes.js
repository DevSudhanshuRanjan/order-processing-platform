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

// for testing puropose only
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

router.get("/test-profile", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.get("/test-admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.status(200).json({ success: true, message: "Welcome Admin!" });
});


export default router;