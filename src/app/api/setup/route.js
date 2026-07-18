import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { validateUsername, validatePassword } from "@/lib/validation";

// GET /api/setup — is the first-admin setup still available?
// setupNeeded is true only while zero users exist (US-1.1).
export async function GET() {
  await connectDB();
  const count = await User.estimatedDocumentCount();
  return NextResponse.json({ setupNeeded: count === 0 });
}

// POST /api/setup — create the very first admin account.
// Disabled once any user exists, so this path can't be replayed.
export async function POST(request) {
  await connectDB();

  const existing = await User.estimatedDocumentCount();
  if (existing > 0) {
    return NextResponse.json(
      { error: "Setup has already been completed." },
      { status: 409 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { clubName, fullName, username, password } = body || {};

  const usernameError = validateUsername(username);
  if (usernameError) return NextResponse.json({ error: usernameError }, { status: 400 });

  const passwordError = validatePassword(password);
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

  // Re-check under a race: a unique index still guards username, but the
  // "zero users" gate isn't transactional on the free tier. If two setup
  // requests arrive together, the second insert will fail on the index.
  try {
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      username: username.trim(),
      passwordHash,
      fullName: (fullName || clubName || username).trim(),
      role: "admin",
      isActive: true,
    });

    await setSessionCookie({
      sub: user._id.toString(),
      role: user.role,
      username: user.username,
    });

    return NextResponse.json({ user: user.toJSON() }, { status: 201 });
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "That username is taken." },
        { status: 409 }
      );
    }
    console.error("Setup failed:", err);
    return NextResponse.json({ error: "Setup failed." }, { status: 500 });
  }
}
