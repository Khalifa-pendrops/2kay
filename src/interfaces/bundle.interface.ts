import { Document } from "mongoose";

export enum BundleStatus {
  CREATED = "created",
  PENDING_SPONSORS = "pending_sponsors",
  PARTIALLY_FUNDED = "partially_funded",
  FULLY_FUNDED = "fully_funded",
  PROCESSED = "processed",
  CANCELLED = "cancelled",
}

export interface IBundle extends Document {
  owner: string; // Reference to Bill Owner
  bills: string[]; // Array of Bills or Bill references
  sponsors: {
    user: string; // Reference to Bill Sponsor
    amount: number;
    status: "pending" | "paid" | "declined";
    transferReference?: string;
    transferCode?: string;
    paymentReference?: string;
    paymentVerified?: boolean;
  }[];
  uniqueLink: string;
  status: BundleStatus;
  totalAmount: number;
  amountFunded: number;
  transferReference?: string; 
  transferCode?: string; 
  createdAt: Date;
  updatedAt: Date;
}

