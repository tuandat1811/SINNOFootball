import Link from "next/link";
import { requirePageUser } from "@/lib/pageAuth";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requirePageUser();
  const isAdmin = user.role === "admin";

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-pitch-dark">SINNO FC</h1>
          <p className="text-sm text-gray-600">
            {user.fullName || user.username}
            <span className="ml-2 rounded-full bg-pitch/10 px-2 py-0.5 text-xs font-medium text-pitch-dark">
              {isAdmin ? "Admin" : "Player"}
            </span>
          </p>
        </div>
        <LogoutButton />
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {isAdmin ? (
          <LinkCard href="/players" title="Roster" desc="Manage players & accounts" epic="Epic 1" />
        ) : (
          <PlaceholderCard title="Roster" desc="Players & accounts" epic="Epic 1" />
        )}
        <PlaceholderCard title="Match Voting" desc="Propose & vote on dates" epic="Epic 2" />
        <PlaceholderCard title="Fund Requests" desc="Collect fees via QR" epic="Epic 3" />
      </section>

      <p className="mt-8 text-center text-xs text-gray-400">
        More feature screens land epic by epic.
      </p>
    </main>
  );
}

function LinkCard({ href, title, desc, epic }) {
  return (
    <Link href={href} className="card block transition hover:border-pitch hover:shadow-md">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {epic}
      </p>
      <h2 className="mt-1 font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{desc}</p>
      <p className="mt-3 text-xs font-medium text-pitch">Open →</p>
    </Link>
  );
}

function PlaceholderCard({ title, desc, epic }) {
  return (
    <div className="card">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {epic}
      </p>
      <h2 className="mt-1 font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{desc}</p>
      <p className="mt-3 text-xs text-gray-400">Coming soon</p>
    </div>
  );
}
