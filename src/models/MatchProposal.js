import mongoose from "mongoose";

// Vote options are embedded — small, bounded, always read with the proposal.
const optionSchema = new mongoose.Schema({
  datetime: { type: Date, required: true },
});

const matchProposalSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    options: {
      type: [optionSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2,
        message: "At least 2 date options required.",
      },
    },
    votingDeadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["open", "closed", "confirmed"],
      default: "open",
    },
    confirmedOptionId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

matchProposalSchema.index({ status: 1, votingDeadline: 1 });

export default mongoose.models.MatchProposal ||
  mongoose.model("MatchProposal", matchProposalSchema);
