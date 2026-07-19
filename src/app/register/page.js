import Link from "next/link";
import { redirect } from "next/navigation";
import { isSetupNeeded } from "@/lib/setup";
import AuthShell from "@/components/AuthShell";
import RegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

// US-1.2 — public player self-registration. On a fresh install (no club yet),
// send to first-admin setup instead.
export default async function RegisterPage() {
  if (await isSetupNeeded()) redirect("/setup");

  return (
    <AuthShell
      title="Join the club"
      subtitle="Create your player account."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
