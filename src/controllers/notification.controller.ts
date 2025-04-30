import { Request, Response } from "express";
import Notification from "../models/notification.model";
import { sendSuccessResponse, sendErrorResponse } from "../utils/apiResponse";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    sendSuccessResponse(res, "Notifications fetched 🎉", notifications);
  } catch (error: any) {
    sendErrorResponse(res, "Failed to get notifications 😞", error.message, 500);
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    await Notification.updateOne(
      { _id: req.params.id, userId: req.user._id },
      { read: true }
    );
    sendSuccessResponse(res, "Notification marked as read ✅");
  } catch (error: any) {
    sendErrorResponse(res, "Failed to update notification 😞", error.message, 500);
  }
};
