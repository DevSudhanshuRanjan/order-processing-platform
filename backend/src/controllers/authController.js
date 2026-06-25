import { validationResult } from "express-validator";
import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const result = await authService.registerUser(req.body);

    return res.status(201).json(result);
    // } catch (error) {
    //   next(error);
    // }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const result = await authService.loginUser(req.body);

    return res.status(200).json(result);
    // } catch (error) {
    //   next(error);
    // }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
