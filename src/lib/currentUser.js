import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import User from "@/models/User";

// Resolves the full, active User document behind the current session cookie.
// Returns null if there's no session, the user is gone, or is deactivated.
// Use in server components and route handlers (Node runtime).
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.sub) return null;

  await connectDB();
  const user = await User.findById(session.sub);
  if (!user || !user.isActive) return null;
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") {
    const err = new Error("Forbidden — admin only");
    err.status = 403;
    throw err;
  }
  return user;
}
