import { Request, Response } from "express";
import OTPService from "../services/otp.service";
import NotificationService from "../services/notification.service";
import { sendSuccessResponse, sendErrorResponse } from "../utils/apiResponse";

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { identifier, purpose } = req.body;
    const code = await OTPService.generateOTP(identifier, purpose);
    await NotificationService.sendOTP(identifier, code, purpose);
    sendSuccessResponse(res, "OTP sent successfully 🎉");
  } catch (error: any) {
    sendErrorResponse(res, "Failed to send OTP 😞", error.message, 500);
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { identifier, code, purpose } = req.body;
    const isValid = await OTPService.verifyOTP(identifier, code, purpose);

    if (!isValid) {
      sendErrorResponse(res, "Invalid OTP 😞", null, 400);
      return;
    }

    sendSuccessResponse(res, "OTP verified successfully 🎉");
  } catch (error: any) {
    sendErrorResponse(res, "Failed to verify OTP 😞", error.message, 500);
  }
};
