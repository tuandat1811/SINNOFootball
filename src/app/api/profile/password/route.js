import { NextResponse } from "next/server";
import { requireUser, handleApiError } from "@/lib/currentUser";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { validatePassword } from "@/lib/validation";

// POST /api/profile/password — change own password (US-1.5).
// Requires the current password (security basic). This device stays logged in;
// other devices' tokens remain valid until expiry (stateless JWT).
export async function POST(request) {
  try {
    const user = await requireUser();

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { currentPassword, newPassword } = body || {};

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required." },
        { status: 400 }
      );
    }

    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
