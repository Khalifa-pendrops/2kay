import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: "payment" | "sponsorship" | "system";
  message: string;
  read: boolean;
  metadata: {
    bundleId?: string;
    amount?: number;
  };
}

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
