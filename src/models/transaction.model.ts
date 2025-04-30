import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  bundleId: mongoose.Types.ObjectId;
  amount: number;
  type: "sponsorship";
  status: "pending" | "completed" | "failed";
}

const TransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bundleId: { type: Schema.Types.ObjectId, ref: "Bundle", required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
