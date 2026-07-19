import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";

// For protected server-component pages. Returns the active user, or bounces
// to the logout route which clears the (stale) cookie before landing on
// /login. Redirecting straight to /login would loop, because middleware sees
// the still-valid token and sends it back to the page. See middleware.js.
export async function requirePageUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/logout");
  return user;
}

// For admin-only pages. Non-admins are sent back to the dashboard.
export async function requireAdminPage() {
  const user = await requirePageUser();
  if (user.role !== "admin") redirect("/");
  return user;
}

// Plain, serializable subset safe to pass from a Server Component into a
// Client Component (Mongoose docs carry toJSON/ObjectId and can't cross that
// boundary).
export function shellUser(user) {
  return {
    role: user.role,
    fullName: user.fullName || "",
    username: user.username,
  };
}
