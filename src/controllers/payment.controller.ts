// import { Request, Response, NextFunction } from "express";
// import PaystackService from "../services/paystack.service";
// import {
//   CreateTransferRecipientArgs,
//   InitiateTransferArgs,
// } from "../interfaces/paystack.interface";
// import Bundle from "../models/bundle.model";
// import { sendSuccessResponse, sendErrorResponse } from "../utils/apiResponse";
// import config from "../config/config";
// import { BundleStatus } from "../interfaces/bundle.interface";
// import User from "../models/user.model";
// import Bill from "../models/bill.model";

// export const initializeSponsorPayment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { bundleId } = req.params;
//     const { email } = req.body;

//     // First find the bundle
//     const bundle = await Bundle.findById(bundleId);
//     if (!bundle) {
//       sendErrorResponse(res, "Bundle not found 😞", null, 404);
//       return;
//     }

//     // Find the sponsor in the bundle
//     //unless sponsor is not attached to a bundle
//     const sponsor = bundle.sponsors.find(
//       (s) => s.user.toString() === req.user.id
//     );
//     if (!sponsor) {
//       sendErrorResponse(
//         res,
//         "You are not a sponsor for this bundle 😞",
//         null,
//         403
//       );
//       return;
//     }

//     // Initialize payment with Paystack
//     const paymentArgs = {
//       email,
//       amount: sponsor.amount * 100,
//       reference: `BUNDLE_${bundleId}_${Date.now()}`,
//       callback_url: `${config.BASE_URL}/api/payment/verify`, //check here ⚠️
//       metadata: {
//         bundleId,
//         sponsorId: req.user.id,
//         amount: sponsor.amount,
//       },
//     };

//     const paymentData = await PaystackService.initializePayment(paymentArgs);

//     // Update sponsor contribution with payment reference
//     sponsor.paymentReference = paymentArgs.reference;
//     await bundle.save();

//     sendSuccessResponse(res, "Payment initialized", {
//       authorizationUrl: paymentData.authorization_url,
//       reference: paymentData.reference,
//     });
//   } catch (error: any) {
//     sendErrorResponse(
//       res,
//       "Payment initialization failed 😞",
//       error.message,
//       400
//     );
//   }
// };

// export const verifyPayment = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { reference } = req.query;

//     if (!reference || typeof reference !== "string") {
//       sendErrorResponse(res, "Payment reference is required 😞", null, 400);
//       return;
//     }

//     // Verify payment with Paystack
//     const verification = await PaystackService.verifyPayment(reference);

//     if (!verification.status || verification.data.status !== "success") {
//       sendErrorResponse(res, "Payment verification failed 😞", null, 400);
//       return;
//     }

//     const { bundleId, sponsorId } = verification.data.metadata;

//     // Find the bundle and update sponsor contribution
//     const bundle = await Bundle.findById(bundleId);
//     if (!bundle) {
//       sendErrorResponse(res, "Bundle not found 😞", null, 404);
//       return;
//     }

//     const sponsor = bundle.sponsors.find(
//       (s) => s.user.toString() === sponsorId
//     );
//     if (!sponsor) {
//       sendErrorResponse(res, "Sponsor not found in bundle 😞", null, 404);
//       return;
//     }

//     // Update the sponsor payment status
//     sponsor.paymentVerified = true;
//     sponsor.status = "paid";

//     // Update the bundle's funded amount
//     bundle.amountFunded += sponsor.amount;

//     // Check if bundle is fully funded
//     if (bundle.amountFunded >= bundle.totalAmount) {
//       bundle.status = BundleStatus.FULLY_FUNDED;
//     } else if (bundle.amountFunded > 0) {
//       bundle.status = BundleStatus.PARTIALLY_FUNDED;
//     }

//     await bundle.save();

//     sendSuccessResponse(res, "Payment verified successfully 🎉", {
//       bundleId,
//       sponsorId,
//       amount: sponsor.amount,
//     });
//   } catch (error: any) {
//     sendErrorResponse(
//       res,
//       "Payment verification failed 😞",
//       error.message,
//       400
//     );
//   }
// };

// export const processDisbursement = async (req: Request, res: Response) => {
//   try {
//     const { bundleId } = req.params;

//     // Find the bundle
//     const bundle = await Bundle.findById(bundleId).populate("bills");
//     if (!bundle) {
//       sendErrorResponse(res, "Bundle not found", null, 404);
//       return;
//     }

//     if (bundle.status !== "fully_funded") {
//       sendErrorResponse(res, "Bundle is not fully funded", null, 400);
//       return;
//     }

//     const bill = await Bill.findById(bundle.bills[0]);
//     if (!bill) {
//       sendErrorResponse(res, "Bill not found", null, 404);
//       return;
//     }

//     // const serviceProvider = await User.findById(bill.serviceProvider);
//        const serviceProvider = await User.findById(bill.merchant);
//     if (!serviceProvider) {
//       sendErrorResponse(res, "Service provider not found", null, 404);
//       return;
//     }

//     // Create transfer recipient
//     //first validate account number abd bank code
//     if (!serviceProvider.bankAccountNumber || !serviceProvider.bankCode) {
//       sendErrorResponse(res, "Missing account info 😞", null, 400);
//       return;
//     }

//     const recipientArgs: CreateTransferRecipientArgs = {
//       type: "nuban",
//       name: `${serviceProvider.firstName} ${serviceProvider.lastName}`,
//       account_number: serviceProvider.bankAccountNumber,
//       bank_code: serviceProvider.bankCode,
//       currency: "NGN",
//       description: `Payment for bundle ${bundleId}`,
//     };

//     const recipient = await PaystackService.createTransferRecipient(
//       recipientArgs
//     );

//     // Initiate transfer
//     const transferArgs: InitiateTransferArgs = {
//       source: "balance" as const,
//       amount: bundle.totalAmount * 100,
//       recipient: recipient.data.recipient_code,
//       reason: `Disbursement for bundle: ${bundleId}`,
//       reference: `DISBURSE_${bundleId}_${Date.now()}`,
//     };

//     const transfer = await PaystackService.initiateTransfer(transferArgs);

//     bundle.transferReference = transferArgs.reference;
//     bundle.transferCode = transfer.data.transfer_code;
//     bundle.status = BundleStatus.PROCESSED;
//     await bundle.save();

//     await Bill.updateMany({ _id: { $in: bundle.bills } }, { status: "paid" });

//     sendSuccessResponse(res, "Disbursement initiated successfully 🎉", {
//       transferReference: transfer.data.reference,
//     });
//   } catch (error: any) {
//     sendErrorResponse(res, "Disbursement failed 😞", error.message, 400);
//   }
// };
