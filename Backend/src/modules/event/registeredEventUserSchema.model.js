import mongoose from "mongoose";

const registeredEventUserSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentId: { type: String }, // New field for payment ID
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
    qrCode: { type: String }, // QR Code for the user
    registeredAt: { type: Date, default: Date.now }, // Timestamp for registration
  },
  {
    timestamps: true,
  }
);

export const RegisteredEventUser = mongoose.model("RegisteredEventUser", registeredEventUserSchema);
