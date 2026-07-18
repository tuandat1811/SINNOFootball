import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin, handleApiError } from "@/lib/currentUser";
import { hashPassword } from "@/lib/auth";
import { validatePassword } from "@/lib/validation";
import User from "@/models/User";

// POST /api/players/[id]/reset-password — admin sets a new password for a
// player who's locked out (US-1.4). Username is untouched.
export async function POST(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { newPassword } = body || {};
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    await connectDB();
    const target = await User.findById(id);
    if (!target) {
      return NextResponse.json({ error: "Player not found." }, { status: 404 });
    }

    target.passwordHash = await hashPassword(newPassword);
    await target.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
