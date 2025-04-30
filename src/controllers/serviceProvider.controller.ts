//I did not implement service for service provider on a separate file
//I did the business logic here in the controller 📝

import { Request, Response } from "express";
import ServiceProvider from "../models/serviceProvider.model";
import { sendSuccessResponse, sendErrorResponse } from "../utils/apiResponse";

export const createServiceProvider = async (req: Request, res: Response) => {
  try {
    const { name, category, bankDetails } = req.body;

    const provider = await ServiceProvider.create({
      name,
      category,
      bankDetails,
      createdBy: req.user.id, // this adds creator reference
    });

    sendSuccessResponse(res, "Service provider created", provider, 201);
  } catch (error: any) {
    if (error.code === 11000) {
      sendErrorResponse(res, "Service provider name already exists", null, 409);
      return;
    }
    sendErrorResponse(res, "Failed to create provider", error.message, 400);
  }
};

export const getServiceProviders = async (req: Request, res: Response) => {
  try {
    const providers = await ServiceProvider.find();
    sendSuccessResponse(res, "Providers retrieved", providers);
  } catch (error: any) {
    sendErrorResponse(res, "Failed to get providers", error.message, 500);
  }
};
