import mongoose, { Schema, Document } from "mongoose";
import { IBundle, BundleStatus } from "../interfaces/bundle.interface";

const sponsorContributionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "declined"],
    default: "pending",
  },
  //paystack details
  transferReference: String,
  transferCode: String,
  paymentReference: { type: String }, // for Paystack reference
  paymentVerified: { type: Boolean, default: false },
});

const bundleSchema: Schema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bills: [{ type: Schema.Types.ObjectId, ref: "Bill", required: true }],
    sponsors: [sponsorContributionSchema],
    uniqueLink: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: Object.values(BundleStatus),
      default: BundleStatus.CREATED,
    },
    totalAmount: { type: Number, required: true },
    amountFunded: { type: Number, default: 0 },
    //for paystack
    paymentReferences: [{ type: String }], // array of all payment references for this bundle
    transferReference: { type: String }, // the reference for disbursement transfer
    transferCode: { type: String }, // for paystack transfer code
  },
  { timestamps: true }
);

// Calculate total amount before saving
bundleSchema.pre<IBundle>("save", function (next) {
  if (this.isModified("bills")) {
    // This will be populated before calculating the total
    if (this.populated("bills")) {
      this.totalAmount = this.bills.reduce(
        (sum, bill) => sum + (bill as any).amount,
        0
      );
    }
  }
  next();
});

export default mongoose.model<IBundle>("Bundle", bundleSchema);
