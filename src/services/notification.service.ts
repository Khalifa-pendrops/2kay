import nodemailer from "nodemailer";
import Notification from "../models/notification.model";
import config from "../config/config";

export default {
  // Send OTP via Email/WhatsApp
  async sendOTP(
    identifier: string,
    code: string,
    purpose: string
  ): Promise<void> {
    if (identifier.includes("@")) {
      await this.sendEmailOTP(identifier, code, purpose);  //email
    } else {
      await this.sendWhatsAppOTP(identifier, code); //whatsapp
    }
  },

  async sendEmailOTP(
    email: string,
    code: string,
    purpose: string
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: config.EMAIL_USER, pass: config.EMAIL_PASSWORD }, 
    });

    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: email,
      subject: `Your OTP for ${purpose.replace("_", " ")}`,
      text: `Your verification code is: ${code}`,
    });
  },

  async sendWhatsAppOTP(phone: string, code: string): Promise<void> {
    const accountSid = config.TWILIO_ACCOUNT_SID;
    const authToken = config.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    await client.messages.create({
      body: `Your verification code is: ${code}`,
      from: `whatsapp:${config.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
    });
  },

  // Create in-app notification
  async createNotification(
    userId: string,
    type: string,
    message: string,
    metadata = {}
  ): Promise<void> {
    await Notification.create({ userId, type, message, metadata });
  },
};
