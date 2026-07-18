import mongoose from "mongoose";

const pushSubscriptionSchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.PushSubscription ||
  mongoose.model("PushSubscription", pushSubscriptionSchema);
