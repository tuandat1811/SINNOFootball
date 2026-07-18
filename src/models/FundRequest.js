import mongoose from "mongoose";

const fundRequestSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: [1, "Amount must be positive."] },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "closed"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.FundRequest ||
  mongoose.model("FundRequest", fundRequestSchema);
