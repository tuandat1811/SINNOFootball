import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin, handleApiError } from "@/lib/currentUser";
import User from "@/models/User";

// PATCH /api/players/[id] — edit a player's profile and/or active status (US-1.4).
// Admin only. Accepts any of: fullName, phone, isActive.
// Username is never changed here (identity anchor), and password reset has its
// own endpoint. Deactivating the last active admin is blocked.
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    await connectDB();
    const target = await User.findById(id);
    if (!target) {
      return NextResponse.json({ error: "Player not found." }, { status: 404 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (typeof body.fullName === "string") target.fullName = body.fullName.trim();
    if (typeof body.phone === "string") target.phone = body.phone.trim();

    // Active-status change with the last-admin guard.
    if (typeof body.isActive === "boolean" && body.isActive !== target.isActive) {
      if (body.isActive === false && target.role === "admin") {
        const activeAdmins = await User.countDocuments({
          role: "admin",
          isActive: true,
        });
        if (activeAdmins <= 1) {
          return NextResponse.json(
            { error: "Cannot deactivate the last admin." },
            { status: 400 }
          );
        }
      }
      target.isActive = body.isActive;
    }

    await target.save();
    return NextResponse.json({ player: target.toJSON() });
  } catch (err) {
    return handleApiError(err);
  }
}
