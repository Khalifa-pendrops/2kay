import mongoose, { Schema } from "mongoose";
import { IServiceProvider } from "../interfaces/serviceProvider.interface";

const ServiceProviderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, 
      index: true,
    },
    category: {
      type: String,
      enum: ["utility", "school", "telecom", "merchant"],
      required: true,
    },
    bankDetails: {
      bankCode: { type: String, required: true },
      accountNumber: { type: String, required: true },
      accountName: { type: String, required: true },
    },
    isVerified: { type: Boolean, default: false },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
  },
  { timestamps: true } 
);

// Removes any existing problematic indexes
const indexes: [Record<string, any>, Record<string, any>][] =
  ServiceProviderSchema.indexes();

indexes.forEach(([fields]) => {
  if (fields["user_1"]) {
    ServiceProviderSchema.index({ user_1: 1 }, { unique: false });
  }
});

export default mongoose.model<IServiceProvider>(
  "ServiceProvider",
  ServiceProviderSchema
);
