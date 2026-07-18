import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin, handleApiError } from "@/lib/currentUser";
import User from "@/models/User";

// GET /api/players — full roster (admins + players), admin only (US-1.4).
export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const users = await User.find().sort({ isActive: -1, createdAt: 1 });
    return NextResponse.json({ players: users.map((u) => u.toJSON()) });
  } catch (err) {
    return handleApiError(err);
  }
}
