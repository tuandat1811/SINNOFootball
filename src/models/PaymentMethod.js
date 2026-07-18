import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, required: true, trim: true }, // e.g. "Bank QR"
    qrImageUrl: { type: String, required: true },
    qrImagePublicId: { type: String }, // Cloudinary id
    isActive: { type: Boolean, default: true }, // soft-delete
  },
  { timestamps: true }
);

export default mongoose.models.PaymentMethod ||
  mongoose.model("PaymentMethod", paymentMethodSchema);
