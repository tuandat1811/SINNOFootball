import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Runs on the Edge runtime. Keep this file dependency-light — no mongoose,
// no bcrypt. It only checks whether a valid session cookie is present and
// redirects accordingly. Fine-grained role checks happen in route handlers.

const COOKIE_NAME = "sinno_session";

// Paths reachable without a session.
const PUBLIC_PATHS = ["/login", "/setup", "/register"];

function isPublicPath(pathname) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  // Auth + setup APIs must be reachable while logged out.
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/api/setup")) return true;
  // The cron endpoint authenticates via its own shared secret.
  if (pathname.startsWith("/api/cron")) return true;
  return false;
}

async function hasValidSession(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const loggedIn = await hasValidSession(request);

  // Logged-in users shouldn't see the login/register/setup screens.
  if (loggedIn && PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPublicPath(pathname)) return NextResponse.next();

  // Everything else requires a session.
  if (!loggedIn) {
    // API clients expect JSON, not an HTML login page. Return 401 so fetch
    // callers can handle it cleanly instead of following a redirect.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Protect app + api routes, but skip Next internals and static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons/).*)",
  ],
};
