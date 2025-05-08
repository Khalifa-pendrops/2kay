// import { NextFunction, Request, Response } from "express";
// import crypto from "crypto";
// import Bundle from "../models/bundle.model";
// import { sendSuccessResponse, sendErrorResponse } from "../utils/apiResponse";
// import config from "../config/config";
// import { BundleStatus } from "../interfaces/bundle.interface";
// import {
//   PaystackWebhookEvent,
//   PaystackChargeSuccessData,
//   PaystackTransferData,
// } from "../interfaces/paystack-events.interface";

// export const handlePaystackWebhook = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     //signature validation
//     // attempt to validate the webhook signature
//     const hash = crypto
//       .createHmac("sha512", config.PAYSTACK_SECRET_KEY)
//       .update(JSON.stringify(req.body))
//       .digest("hex");

//     if (hash !== req.headers["x-paystack-signature"]) {
//       sendErrorResponse(res, "Invalid signature 😞", null, 401);
//       return;
//     }

//     const event = req.body as PaystackWebhookEvent;

//     switch (event.event) {
//       case "charge.success":
//         await handleSuccessfulCharge(event.data as PaystackChargeSuccessData);
//         break;
//       case "transfer.success":
//       case "transfer.failed":
//         await handleTransferEvent(
//           event as PaystackWebhookEvent<PaystackTransferData>
//         );
//         break;
//       default:
//         console.log(`Unhandled event type: ${event.event}`);
//     }

//     sendSuccessResponse(res, "Webhook received");
//   } catch (error: any) {
//     sendErrorResponse(res, "Webhook processing failed", error.message, 400);
//   }
// };

// async function handleTransferEvent(
//   event: PaystackWebhookEvent<PaystackTransferData>
// ) {
//   const { reference } = event.data;
//   const status = event.event === "transfer.success" ? "completed" : "failed";

//   await Bundle.findOneAndUpdate(
//     { transferReference: reference },
//     { $set: { transferStatus: status } }
//   );
// }

// async function handleSuccessfulCharge(data: any) {
//   const { reference, metadata } = data;

//   // Find the bundle and update sponsor contribution
//   const bundle = await Bundle.findOne({
//     "sponsors.paymentReference": reference,
//   });

//   if (!bundle) return;

//   const sponsor = bundle.sponsors.find((s) => s.paymentReference === reference);
//   if (!sponsor) return;

//   // Update sponsor payment status
//   sponsor.paymentVerified = true;
//   sponsor.status = "paid";

//   // Update bundle's funded amount
//   bundle.amountFunded += sponsor.amount;

//   // Check if bundle is fully funded
//   if (bundle.amountFunded >= bundle.totalAmount) {
//     bundle.status = BundleStatus.FULLY_FUNDED;
//   } else if (bundle.amountFunded > 0) {
//     bundle.status = BundleStatus.PARTIALLY_FUNDED;
//   }

//   await bundle.save();
// }

// async function handleSuccessfulTransfer(data: any) {
//   const { reference } = data;

//   // Find the bundle and update transfer status
//   await Bundle.findOneAndUpdate(
//     { transferReference: reference },
//     { $set: { transferStatus: "completed" } }
//   );
// }

// async function handleFailedTransfer(data: any) {
//   const { reference } = data;

//   // Find the bundle and update transfer status
//   await Bundle.findOneAndUpdate(
//     { transferReference: reference },
//     { $set: { transferStatus: "failed" } }
//   );
// }
