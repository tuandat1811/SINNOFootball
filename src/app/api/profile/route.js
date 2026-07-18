import { NextResponse } from "next/server";
import { requireUser, handleApiError } from "@/lib/currentUser";

// PATCH /api/profile — the logged-in user edits their own name/phone (US-1.5).
// Operates on the session user; username is never editable here (identity anchor).
export async function PATCH(request) {
  try {
    const user = await requireUser();

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (typeof body.fullName === "string") user.fullName = body.fullName.trim();
    if (typeof body.phone === "string") user.phone = body.phone.trim();

    await user.save();
    return NextResponse.json({ user: user.toJSON() });
  } catch (err) {
    return handleApiError(err);
  }
}
