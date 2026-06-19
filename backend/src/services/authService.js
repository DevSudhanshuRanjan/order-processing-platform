import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (payload) => {
  const { name, email, password } = payload;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User Already Exists");
  }

  await User.create({
    name,
    email,
    password,
  });

  return {
    success: true,
    message: "User Created Successfully",
  };
};

export const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("User Does Not Exist");
  }

  if (user.status === "blocked") {
    throw new Error("Account Blocked");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  const token = generateToken(user);

  return {
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};