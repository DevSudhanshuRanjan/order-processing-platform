import mongoose from "mongoose";
import { validationResult } from "express-validator";

import * as productService from "../services/productService.js";
import { uploadMiddleware, createImage as uploadImage } from "../controllers/imageController.js";

export const getProducts = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await productService.getAllProducts(
        req.query
      );

    res.status(200).json({
      success: true,
      products: data.products,
      page: data.page,
      totalPages: data.totalPages,
      totalProducts:
        data.totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById =
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Product ID",
        });
      }

      const product =
        await productService.getProduct(
          id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product Not Found",
        });
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      next(error);
    }
  };

export const createProduct =
  async (req, res, next) => {
    try {
      console.log('Create Product - Request body:', req.body);
      console.log('Create Product - Request files:', req.files);
      
      const errors =
        validationResult(req);

      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          message:
            errors.array()[0].msg,
        });
      }

      let imageId = req.body.image || null;
      
      if (req.files && req.files.length > 0) {
        const result = await uploadImage({ 
          file: req.files[0], 
          res: { status: () => ({ json: () => {} }) }, 
          next 
        });
        // Extract the image ID from the result
        imageId = result.image.id;
      }

      const productData = {
        ...req.body,
        image: imageId
      };

      await productService.create(
        productData,
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: "Product Added",
      });
    } catch (error) {
      next(error);
    }
  };

export const updateProduct =
  async (req, res, next) => {
    try {
      const errors =
        validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message:
            errors.array()[0].msg,
        });
      }

      let imageId = req.body.image || null;
      
      if (req.files && req.files.length > 0) {
        const result = await uploadImage({ 
          file: req.files[0], 
          res: { status: () => ({ json: () => {} }) }, 
          next 
        });
        imageId = result.image.id;
      }

      const productData = {
        ...req.body,
        ...(imageId && { image: imageId })
      };

      const product =
        await productService.update(
          req.params.id,
          productData,
          req.user.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product Not Found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Product Updated",
      });
    } catch (error) {
      next(error);
    }
  };

export const deleteProduct =
  async (req, res, next) => {
    try {
      const product =
        await productService.remove(
          req.params.id,
          req.user.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product Not Found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Product Deleted",
      });
    } catch (error) {
      next(error);
    }
  };

export const getVendorProducts =
  async (req, res, next) => {
    try {
      const products =
        await productService.getVendorProducts(
          req.user.id
        );

      res.status(200).json({
        products,
      });
    } catch (error) {
      next(error);
    }
  };