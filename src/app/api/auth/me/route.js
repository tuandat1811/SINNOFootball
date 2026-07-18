import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";

// GET /api/auth/me — the current logged-in user, or 401.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user: user.toJSON() });
}
