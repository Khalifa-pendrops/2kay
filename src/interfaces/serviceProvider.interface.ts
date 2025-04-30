import { Document } from "mongoose";

export interface IServiceProvider extends Document {
  name: string;
  category: "utility" | "school" | "telecom" | "merchant" | "others";
  bankDetails?: {
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
  isVerified: boolean;
}
