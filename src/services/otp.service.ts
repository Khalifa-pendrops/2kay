import crypto from "crypto";
import OTP from "../models/otp.model";

export default {
  async generateOTP(identifier: string, purpose: string): Promise<string> {
    await OTP.deleteMany({ identifier, purpose });

    const code = crypto.randomInt(100000, 999999).toString();
    await OTP.create({
      identifier,
      code,
      purpose,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
    return code;
  },

  async verifyOTP(
    identifier: string,
    code: string,
    purpose: string
  ): Promise<boolean> {
    const otp = await OTP.findOne({ identifier, purpose });
    if (!otp || otp.code !== code || otp.expiresAt < new Date()) return false;

    otp.verified = true;
    await otp.save();
    return true;
  },
}; 
