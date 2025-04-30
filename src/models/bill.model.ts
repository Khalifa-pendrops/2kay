import mongoose, { Schema, Document } from "mongoose";
import { IBill, BillStatus } from "../interfaces/bill.interface";

const billSchema: Schema = new Schema(
  {
    serviceProvider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: Object.values(BillStatus),
      default: BillStatus.PENDING,
    },
    description: { type: String },
    referenceNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBill>("Bill", billSchema);
