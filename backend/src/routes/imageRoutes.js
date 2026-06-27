import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  createImage,
  getImage,
  updateImage,
  deleteImage,
  uploadMiddleware,
} from "../controllers/imageController.js";

const router = express.Router();

router.get("/:id", getImage);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadMiddleware,
  createImage
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadMiddleware,
  updateImage
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteImage
);

export default router;
