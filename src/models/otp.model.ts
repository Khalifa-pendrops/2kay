import mongoose, { Schema, Document } from "mongoose";

interface IOTP extends Document {
  identifier: string; // either email or phone
  code: string;
  purpose: "registration" | "password_reset" | "profile_update";
  expiresAt: Date;
  verified: boolean;
}

const OTPSchema = new Schema(
  {
    identifier: { type: String, required: true },
    code: { type: String, required: true },
    purpose: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-delete expired OTPs after 15 minutes
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOTP>("OTP", OTPSchema);
