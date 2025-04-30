import crypto from "crypto";

export const generateUniqueLink = (): string => {
  return crypto.randomBytes(16).toString("hex");
};
