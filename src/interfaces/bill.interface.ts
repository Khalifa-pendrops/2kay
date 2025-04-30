import { Document } from "mongoose";

export enum BillStatus {
  PENDING = "pending",
  PARTIALLY_PAID = "partially_paid",
  PAID = "paid",
  CANCELLED = "cancelled",
}

export interface IBill extends Document {
  serviceProvider: string; // Reference to ServiceProvider
  amount: number;
  dueDate?: Date;
  status: BillStatus;
  description?: string;
  referenceNumber: string;
}
