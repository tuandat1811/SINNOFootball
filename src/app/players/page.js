import Link from "next/link";
import { requireAdminPage } from "@/lib/pageAuth";
import Roster from "./Roster";

export const dynamic = "force-dynamic";

// US-1.4 — admin roster management.
export default async function PlayersPage() {
  const admin = await requireAdminPage();

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-pitch hover:underline">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-xl font-bold text-pitch-dark">Roster</h1>
        </div>
      </header>

      <Roster currentAdminId={admin._id.toString()} />
    </main>
  );
}
