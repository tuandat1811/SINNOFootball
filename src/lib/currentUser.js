import { NextResponse } from "next/server";
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

// Converts an error thrown by requireUser/requireAdmin (or anything else) into
// a JSON response. Route handlers wrap their body in try/catch and call this.
export function handleApiError(err) {
  const status = err?.status;
  if (status === 401 || status === 403) {
    return NextResponse.json({ error: err.message }, { status });
  }
  // Malformed ObjectId (e.g. /api/players/garbage) — a bad request, not a fault.
  if (err?.name === "CastError") {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }
  // Mongoose schema validation failure — surface the first message.
  if (err?.name === "ValidationError") {
    const first = Object.values(err.errors || {})[0]?.message;
    return NextResponse.json({ error: first || "Validation failed." }, { status: 400 });
  }
  console.error("API error:", err);
  return NextResponse.json({ error: "Server error." }, { status: 500 });
}
