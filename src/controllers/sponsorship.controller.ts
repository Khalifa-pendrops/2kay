// import { Request, Response } from "express";
// import LinkService from "../services/link.service";
// import NotificationService from "../services/notification.service";
// import { sendSuccessResponse, sendErrorResponse } from "../utils/apiResponse";
// import Bundle from "../models/bundle.model";

// export const sendSponsorLink = async (req: Request, res: Response) => {
//   try {
//     const { bundleId, recipient } = req.body;

//     // Verify bundle exists
//     const bundle = await Bundle.findById(bundleId);
//     if (!bundle) {
//       sendErrorResponse(res, "Bundle not found", null, 404);
//       return;
//     }

//     // Generate tracked link
//     const { link } = await LinkService.generateSponsorLink(
//       bundleId,
//       req.user.id, // Current authenticated user
//       recipient
//     );

//     // Send notification using the unified service
//     await NotificationService.sendSponsorshipLink(
//       recipient,
//       link,
//       bundle.name,
//       req.user.firstName as string
//     );

//     sendSuccessResponse(res, "Sponsorship link sent 🎉", { link });
//   } catch (error: any) {
//     sendErrorResponse(res, "Failed to send link 😞", error.message, 500);
//   }
// };

// export const resendSponsorLink = async (req: Request, res: Response) => {
//   try {
//     const { bundleId, recipient } = req.body;

//     // Verify bundle exists
//     const bundle = await Bundle.findById(bundleId);
//     if (!bundle) {
//       sendErrorResponse(res, "Bundle not found", null, 404);
//       return;
//     }

//     // Generate new link
//     const { link } = await LinkService.generateSponsorLink(
//       bundleId,
//       req.user.id,
//       recipient
//     );

//     // Resend using the same method
//     await NotificationService.sendSponsorshipLink(
//       recipient,
//       link,
//       bundle.name,
//       req.user.firstName as string
//     );

//     sendSuccessResponse(res, "Link resent successfully", { link });
//   } catch (error: any) {
//     sendErrorResponse(res, "Resend failed", error.message, 400);
//   }
// };

// export const validateSponsorLink = async (req: Request, res: Response) => {
//   try {
//     const { token } = req.params;
//     const validation = await LinkService.validateLink(token);

//     if (!validation.valid) {
//       sendErrorResponse(res, "Invalid or expired link", null, 400);
//       return;
//     }

//     sendSuccessResponse(res, "Link is valid", {
//       bundleId: validation.bundleId,
//     });
//   } catch (error: any) {
//     sendErrorResponse(res, "Validation failed", error.message, 400);
//   }
// };
