import { connectDB } from "@/lib/db";
import User from "@/models/User";

// True only on a fresh deployment with zero users — gates the first-admin
// setup flow (US-1.1).
export async function isSetupNeeded() {
  await connectDB();
  const count = await User.estimatedDocumentCount();
  return count === 0;
}
