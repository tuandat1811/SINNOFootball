import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchProposal",
      required: true,
    },
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    optionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    votedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One vote per player per proposal; re-voting updates this same doc.
voteSchema.index({ proposalId: 1, playerId: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model("Vote", voteSchema);
