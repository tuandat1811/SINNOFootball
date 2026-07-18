import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { validateUsername, validatePassword, normalizeUsername } from "@/lib/validation";

// POST /api/auth/register — public self-registration (US-1.2).
// Anyone can create a player account; admin can deactivate unwanted
// signups afterward (US-1.4). New players are active immediately and
// are auto-logged-in on success.
export async function POST(request) {
  await connectDB();

  // A club must already exist (an admin was created via /setup) before
  // players can self-register — otherwise the first-ever user would be a
  // player with no admin. Fresh installs are routed to /setup instead.
  const userCount = await User.estimatedDocumentCount();
  if (userCount === 0) {
    return NextResponse.json(
      { error: "The club hasn't been set up yet." },
      { status: 409 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { fullName, username, password } = body || {};

  const usernameError = validateUsername(username);
  if (usernameError) return NextResponse.json({ error: usernameError }, { status: 400 });

  const passwordError = validatePassword(password);
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

  try {
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      username: normalizeUsername(username),
      passwordHash,
      fullName: (fullName || username).trim(),
      role: "player",
      isActive: true,
    });

    await setSessionCookie({
      sub: user._id.toString(),
      role: user.role,
      username: user.username,
    });

    return NextResponse.json({ user: user.toJSON() }, { status: 201 });
  } catch (err) {
    // Unique index on username → collision (US-1.2 edge case).
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "That username is taken." },
        { status: 409 }
      );
    }
    console.error("Registration failed:", err);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
