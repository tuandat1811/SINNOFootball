import { redirect } from "next/navigation";
import { isSetupNeeded } from "@/lib/setup";
import SetupForm from "./SetupForm";

export const dynamic = "force-dynamic";

// US-1.1 — first-admin setup. Once any user exists, this path is closed.
export default async function SetupPage() {
  const needed = await isSetupNeeded();
  if (!needed) redirect("/login");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-pitch-dark">Welcome ⚽</h1>
        <p className="mt-1 mb-6 text-sm text-gray-600">
          Set up your club and create the first admin account.
        </p>
        <SetupForm />
      </div>
    </main>
  );
}
