import { Request, Response } from "express";
import {
  createBundle,
  getBundleByLink,
  sponsorContribution,
  processBundle,
  getUserBundles,
} from "../services/bundle.service";
import { sendSuccessResponse, sendErrorResponse } from "../utils/apiResponse";
import config from "../config/config";

export const create = async (req: Request, res: Response) => {
  try {
    const { billIds, sponsorEmails } = req.body;
    const bundle = await createBundle(req.user.id, billIds, sponsorEmails);
    sendSuccessResponse(res, "Bundle created successfully 🎉", bundle, 201);
  } catch (error: any) {
    sendErrorResponse(res, "Failed to create bundle 😞", error.message, 400);
  }
};

export const getByLink = async (req: Request, res: Response) => {
  try {
    const { uniqueLink } = req.params;
    const bundle = await getBundleByLink(uniqueLink);
    sendSuccessResponse(res, "Bundle retrieved successfully 🎉", bundle);
  } catch (error: any) {
    sendErrorResponse(res, "Failed to retrieve bundle 😞", error.message, 404);
  }
};

export const contribute = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      sendErrorResponse(res, "Authentication required", null, 401);
      return;
    }

    const { bundleId } = req.params;
    const { amount } = req.body;

    if (!bundleId || !amount || isNaN(amount)) {
      sendErrorResponse(res, "Invalid bundle ID or amount", null, 400);
      return;
    }

    const bundle = await sponsorContribution(
      bundleId,
      req.user.id,
      parseFloat(amount)
    );

    sendSuccessResponse(res, "Contribution successful 🎉", bundle);
  } catch (error: any) {
    sendErrorResponse(
      res,
      "Failed to process contribution 😞",
      error.message,
      400
    );
  }
};

export const process = async (req: Request, res: Response) => {
  try {
    const { bundleId } = req.params;
    const bundle = await processBundle(bundleId);
    sendSuccessResponse(res, "Bundle processed successfully 🎉", bundle);
  } catch (error: any) {
    sendErrorResponse(res, "Failed to process bundle 😞", error.message, 400);
  }
};

export const getMyBundles = async (req: Request, res: Response) => {
  try {
    const bundles = await getUserBundles(req.user.id);
    sendSuccessResponse(res, "Bundles retrieved successfully 🎉", bundles);
  } catch (error: any) {
    sendErrorResponse(res, "Failed to retrieve bundles 😞", error.message, 400);
  }
};
