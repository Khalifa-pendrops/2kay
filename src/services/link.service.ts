import crypto from "crypto";
import config from "../config/config";

export default {
  generateSponsorLink(bundleId: string): { token: string; link: string } {
    const token = crypto.randomBytes(32).toString("hex");
    const link = `${config.BASE_URL}/sponsor/${bundleId}?token=${token}`;
    return { token, link };
  },

  isLinkExpired(createdAt: Date): boolean {
    return Date.now() - new Date(createdAt).getTime() > 7 * 24 * 60 * 60 * 1000; // 7 days validity
  },
};
