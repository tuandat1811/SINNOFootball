import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { normalizeUsername } from "@/lib/validation";

// POST /api/auth/login — authenticate with username + password (US-1.3).
export async function POST(request) {
  await connectDB();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { username, password } = body || {};
  if (!username || !password) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 }
    );
  }

  const user = await User.findOne({ username: normalizeUsername(username) });

  // Generic error for both "no user" and "wrong password" (no field-level
  // leakage). Still run a hash comparison shape only when a user exists.
  if (!user) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 }
    );
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 }
    );
  }

  if (!user.isActive) {
    return NextResponse.json(
      { error: "This account has been deactivated." },
      { status: 403 }
    );
  }

  await setSessionCookie({
    sub: user._id.toString(),
    role: user.role,
    username: user.username,
  });

  return NextResponse.json({ user: user.toJSON() });
}
