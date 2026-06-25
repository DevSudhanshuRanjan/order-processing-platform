import { body } from "express-validator";

export const placeOrderValidator = [
  body("address.fullName")
    .trim()
    .notEmpty()
    .withMessage("Invalid Address"),

  body("address.phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Invalid Address"),

  body("address.house")
    .trim()
    .notEmpty()
    .withMessage("Invalid Address"),

  body("address.street")
    .trim()
    .notEmpty()
    .withMessage("Invalid Address"),

  body("address.city")
    .trim()
    .notEmpty()
    .withMessage("Invalid Address"),

  body("address.state")
    .trim()
    .notEmpty()
    .withMessage("Invalid Address"),

  body("address.pincode")
    .matches(/^[0-9]{6}$/)
    .withMessage("Invalid Address"),

  body("location.latitude")
    .isFloat()
    .withMessage("Invalid Coordinates"),

  body("location.longitude")
    .isFloat()
    .withMessage("Invalid Coordinates"),
];

export const updateOrderStatusValidator =
  [
    body("status")
      .isIn([
        "Pending",
        "Preparing",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ])
      .withMessage(
        "Invalid Order Status"
      ),
  ];