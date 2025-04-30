import { Request, Response } from "express";
import LinkService from "../services/link.service";
import NotificationService from "../services/notification.service";
import { sendSuccessResponse, sendErrorResponse } from "../utils/apiResponse";

export const sendSponsorLink = async (req: Request, res: Response) => {
  try {
    const { bundleId, recipient } = req.body;
    const { link } = LinkService.generateSponsorLink(bundleId);

    if (recipient.includes("@")) {
      await NotificationService.sendEmailOTP(
        recipient,
        "Sponsorship Request",
        `You've been invited to sponsor bills. This link expires in 7 days. Kindly click here to proceed with funding bundle: ${link}`
      );
    } else {
      await NotificationService.sendWhatsAppOTP(
        recipient,
        `Sponsorship invite: ${link}`
      );
    }

    sendSuccessResponse(res, "Sponsorship link sent 🎉");
  } catch (error: any) {
    sendErrorResponse(res, "Failed to send link 😞", error.message, 500);
  }
};
