import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    fundRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FundRequest",
      required: true,
    },
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
    markedAt: { type: Date },
  },
  { timestamps: true }
);

// One payment per player per fund request.
paymentSchema.index({ fundRequestId: 1, playerId: 1 }, { unique: true });

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
