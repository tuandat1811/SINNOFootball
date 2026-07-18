import Link from "next/link";
import { redirect } from "next/navigation";
import { isSetupNeeded } from "@/lib/setup";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

// US-1.3 — player/admin login. On a fresh install, send to setup instead.
export default async function LoginPage() {
  if (await isSetupNeeded()) redirect("/setup");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-pitch-dark">SINNO FC</h1>
        <p className="mt-1 mb-6 text-sm text-gray-600">Sign in to your club.</p>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          New here?{" "}
          <Link href="/register" className="font-medium text-pitch hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
