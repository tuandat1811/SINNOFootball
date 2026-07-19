import Link from "next/link";
import { redirect } from "next/navigation";
import { isSetupNeeded } from "@/lib/setup";
import AuthShell from "@/components/AuthShell";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

// US-1.3 — player/admin login. On a fresh install, send to setup instead.
export default async function LoginPage() {
  if (await isSetupNeeded()) redirect("/setup");

  return (
    <AuthShell
      title="SINNO FC"
      subtitle="Sign in to your club."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-brand-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
