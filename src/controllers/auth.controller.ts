import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/auth.service";
import { sendSuccessResponse, sendErrorResponse } from "../utils/apiResponse";


export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;
    const user = await registerUser(
      firstName,
      lastName,
      email,
      password,
      role,
      phone
    );
    sendSuccessResponse(res, "User registered successfully 🎉", user, 201);
  } catch (error: any) {
    sendErrorResponse(res, "Registration failed 😞", error.message, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    sendSuccessResponse(res, "Login successful 🎉", { token });
    } catch (error: any) {
    sendErrorResponse(res, "Login failed 😞", error.message, 401);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await getCurrentUser(req.user.id);
    sendSuccessResponse(res, "User retrieved successfully", user);
  } catch (error: any) {
    sendErrorResponse(res, "Failed to retrieve user", error.message, 404);
  }
};
