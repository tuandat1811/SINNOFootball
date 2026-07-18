import Link from "next/link";
import { redirect } from "next/navigation";
import { isSetupNeeded } from "@/lib/setup";
import RegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

// US-1.2 — public player self-registration. On a fresh install (no club yet),
// send to first-admin setup instead.
export default async function RegisterPage() {
  if (await isSetupNeeded()) redirect("/setup");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-pitch-dark">Join the club</h1>
        <p className="mt-1 mb-6 text-sm text-gray-600">
          Create your player account.
        </p>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-pitch hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
