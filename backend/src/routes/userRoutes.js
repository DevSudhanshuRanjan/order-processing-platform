import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all profile routes
router.use(authMiddleware);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
