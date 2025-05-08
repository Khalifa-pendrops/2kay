import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Notification from "../models/notification.model";
import config from "../config/config";
import { compile } from "handlebars"; 

const templates: Record<string, any> = {};

export default {
  async init() {
    this.loadTemplate("otp-email");
    this.loadTemplate("otp-whatsapp");
    this.loadTemplate("sponsorship-invite-email");
    this.loadTemplate("sponsorship-invite-whatsapp");
  },

  loadTemplate(name: string) {
    const emailPath = path.join(__dirname, `../templates/${name}.html`);
    const whatsappPath = path.join(__dirname, `../templates/${name}.txt`);

    if (fs.existsSync(emailPath)) {
      templates[`${name}-email`] = compile(fs.readFileSync(emailPath, "utf8"));
    }

    if (fs.existsSync(whatsappPath)) {
      templates[`${name}-whatsapp`] = compile(
        fs.readFileSync(whatsappPath, "utf8")
      );
    }
  },

  async send(
    type: "otp" | "sponsorship-invite",
    recipient: string,
    data: Record<string, any>
  ): Promise<void> {
    if (recipient.includes("@")) {
      await this.sendEmail(type, recipient, data);
    } else {
      await this.sendWhatsApp(type, recipient, data);
    }
  },

  /**
   * Email sender
   */
  async sendEmail(
    type: string,
    email: string,
    data: Record<string, any>
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: config.EMAIL_USER, pass: config.EMAIL_PASSWORD },
    });

    const template = templates[`${type}-email`];
    if (!template) throw new Error(`Email template not found for ${type}`);

    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: email,
      subject: data.subject || `${type.replace("-", " ")} notification`,
      html: template(data),
      text: template(data),
    });
  },

  /**
   * WhatsApp sender
   */
  async sendWhatsApp(
    type: string,
    phone: string,
    data: Record<string, any>
  ): Promise<void> {
    const accountSid = config.TWILIO_ACCOUNT_SID;
    const authToken = config.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    const template = templates[`${type}-whatsapp`];
    if (!template) throw new Error(`WhatsApp template not found for ${type}`);

    await client.messages.create({
      body: template(data),
      from: `whatsapp:${config.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
    });
  },

  async sendOTP(
    identifier: string,
    code: string,
    purpose: string
  ): Promise<void> {
    await this.send("otp", identifier, { code, purpose });
  },

  async sendSponsorshipLink(
    recipient: string,
    link: string,
    bundleName: string,
    ownerName: string
  ): Promise<void> {
    await this.send("sponsorship-invite", recipient, {
      link,
      bundleName,
      ownerName,
      subject: `Sponsorship Request for ${bundleName}`,
    });
  },

  async createNotification(
    userId: string,
    type: string,
    message: string,
    metadata = {}
  ): Promise<void> {
    await Notification.create({ userId, type, message, metadata });
  },
};
