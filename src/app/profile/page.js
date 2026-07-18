import Link from "next/link";
import { requirePageUser } from "@/lib/pageAuth";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

// US-1.5 — any logged-in user edits their own profile.
export default async function ProfilePage() {
  const user = await requirePageUser();

  return (
    <main className="mx-auto max-w-md p-4 sm:p-6">
      <header className="mb-6">
        <Link href="/" className="text-sm text-pitch hover:underline">
          ← Dashboard
        </Link>
        <h1 className="mt-1 text-xl font-bold text-pitch-dark">My Profile</h1>
      </header>

      <ProfileForm
        initial={{
          username: user.username,
          fullName: user.fullName || "",
          phone: user.phone || "",
        }}
      />
    </main>
  );
}
