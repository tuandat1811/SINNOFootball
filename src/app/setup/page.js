import { redirect } from "next/navigation";
import { isSetupNeeded } from "@/lib/setup";
import AuthShell from "@/components/AuthShell";
import SetupForm from "./SetupForm";

export const dynamic = "force-dynamic";

// US-1.1 — first-admin setup. Once any user exists, this path is closed.
export default async function SetupPage() {
  const needed = await isSetupNeeded();
  if (!needed) redirect("/login");

  return (
    <AuthShell
      title="Welcome to SINNO FC"
      subtitle="Create the first admin account to begin."
    >
      <SetupForm />
    </AuthShell>
  );
}
