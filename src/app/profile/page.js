import { requirePageUser, shellUser } from "@/lib/pageAuth";
import AppShell from "@/components/AppShell";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

// US-1.5 — any logged-in user edits their own profile.
export default async function ProfilePage() {
  const user = await requirePageUser();

  return (
    <AppShell user={shellUser(user)}>
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Profile &amp; settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account.</p>
      </header>
      <ProfileForm
        initial={{
          username: user.username,
          fullName: user.fullName || "",
          phone: user.phone || "",
        }}
      />
    </AppShell>
  );
}
