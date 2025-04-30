import jwt from "jsonwebtoken";
import User from "../models/user.model";
import config from "../config/config";
import { IUser } from "../interfaces/user.interfaces";
import { sendErrorResponse } from "../utils/apiResponse";

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role?: string,
  phone?: string
): Promise<IUser> => {
  // first check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const user = new User({
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
  });

  await user.save();
  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<string> => {
  // First find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check if password is a match
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET as string, {
    expiresIn: "30d",
  });

  return token;
};

export const getCurrentUser = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
