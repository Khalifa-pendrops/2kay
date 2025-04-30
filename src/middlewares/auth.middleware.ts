import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import User from "../models/user.model";
import { sendErrorResponse } from "../utils/apiResponse";

interface AuthenticatedRequest extends Request {
  user: typeof User | any;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from req header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      sendErrorResponse(res, "Authentication required", null, 401);
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };

    // Find a user from DB with the token
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      sendErrorResponse(res, "User with token not found ", null, 401);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    sendErrorResponse(res, "Please authenticate first", error, 401);
  }
};

//though role is optional or will likely not be used in the frontend
//still implimented role based authentication
export const authorize = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!roles.includes(req.user.role)) {
      sendErrorResponse(
        res,
        `User role ${req.user.role} is not authorized to access this route`, 
        null,
        403
      );
      return;
    }
    next();
  };
};
