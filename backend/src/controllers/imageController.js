import mongoose from "mongoose";
import sharp from "sharp";
import multer from "multer";
import Image from "../models/Image.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export const uploadMiddleware = upload.single("image");

export const createImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const processedBuffer = await sharp(req.file.buffer)
      .resize(1280, 720, {
        fit: "cover",
        position: "center",
        withoutEnlargement: false,
      })
      .avif({ quality: 80 })
      .toBuffer();

    const image = await Image.create({
      data: processedBuffer,
      contentType: "image/avif",
    });

    res.status(201).json({
      success: true,
      message: "Image created successfully",
      image: {
        id: image._id,
        contentType: image.contentType,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Image ID",
      });
    }

    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image Not Found",
      });
    }

    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (error) {
    next(error);
  }
};

export const updateImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Image ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const processedBuffer = await sharp(req.file.buffer)
      .resize(1280, 720, {
        fit: "cover",
        position: "center",
        withoutEnlargement: false,
      })
      .avif({ quality: 80 })
      .toBuffer();

    const image = await Image.findByIdAndUpdate(
      id,
      {
        data: processedBuffer,
        contentType: "image/avif",
      },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      image: {
        id: image._id,
        contentType: image.contentType,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Image ID",
      });
    }

    const image = await Image.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};