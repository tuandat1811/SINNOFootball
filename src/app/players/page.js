import { requireAdminPage, shellUser } from "@/lib/pageAuth";
import AppShell from "@/components/AppShell";
import Roster from "./Roster";

export const dynamic = "force-dynamic";

// US-1.4 / US-1.6 — admin roster management.
export default async function PlayersPage() {
  const admin = await requireAdminPage();

  return (
    <AppShell user={shellUser(admin)}>
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Roster</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage players and accounts. New players join via the sign-up page.
        </p>
      </header>
      <Roster currentAdminId={admin._id.toString()} />
    </AppShell>
  );
}
