import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Stored lowercase so usernames are case-insensitive for uniqueness and
    // login. Display name lives in `fullName`. Mongoose applies `lowercase`
    // to both writes and query filters on this path.
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    avatarUrl: { type: String },
    avatarPublicId: { type: String }, // Cloudinary id, for replace/delete
    role: {
      type: String,
      enum: ["admin", "player"],
      default: "player",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Never leak the password hash when serializing to JSON.
userSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
