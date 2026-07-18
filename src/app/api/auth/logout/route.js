import { NextResponse } from "next/server";
import { clearSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth";

// POST /api/auth/logout — explicit logout (called by the Log out button).
export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}

// GET /api/auth/logout — clear the session and redirect to /login.
// Used when a protected page finds the session is stale (e.g. the user was
// deactivated or deleted while still holding a valid token). Clearing the
// cookie here — on the response — breaks the redirect loop that would
// otherwise bounce between the page and /login. See src/lib/pageAuth.js.
export async function GET(request) {
  const res = NextResponse.redirect(new URL("/login", request.url));
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
}
