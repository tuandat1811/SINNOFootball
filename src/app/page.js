import Link from "next/link";
import { requirePageUser, shellUser } from "@/lib/pageAuth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import AppShell from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requirePageUser();
  const isAdmin = user.role === "admin";

  let activeCount = 0;
  if (isAdmin) {
    await connectDB();
    activeCount = await User.countDocuments({ isActive: true });
  }

  return (
    <AppShell user={shellUser(user)}>
      {isAdmin ? (
        <AdminHome name={user.fullName || user.username} activeCount={activeCount} />
      ) : (
        <PlayerHome name={user.fullName || user.username} />
      )}
    </AppShell>
  );
}

function PlayerHome({ name }) {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">Welcome back, {name}</h1>
      <p className="mt-1 text-sm text-gray-500">A quick snapshot of your club.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard title="Next match" body="No confirmed match yet." href="/matches" cta="View matches" />
        <InfoCard title="Open votes" body="Nothing to vote on right now." href="/matches" cta="View matches" />
        <InfoCard title="Fund requests" body="You're all settled up." href="/funds" cta="View funds" />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Match voting and fund tracking arrive with the next updates.
      </p>
    </>
  );
}

function AdminHome({ name, activeCount }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin overview</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, {name}.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/matches" className="btn-secondary btn-sm">+ New Match</Link>
          <Link href="/funds" className="btn-secondary btn-sm">+ Fund Request</Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard title="Open votes" body="No open proposals yet." href="/matches" cta="Matches" soon />
        <InfoCard title="Fund requests" body="No active requests yet." href="/funds" cta="Funds" soon />
        <StatCard title="Roster" value={activeCount} unit="active members" href="/players" cta="Manage roster" />
      </div>
    </>
  );
}

function InfoCard({ title, body, href, cta, soon }) {
  return (
    <div className="card flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {soon && <span className="badge-gray">Soon</span>}
      </div>
      <p className="mt-1 flex-1 text-sm text-gray-500">{body}</p>
      <Link href={href} className="mt-4 text-sm font-semibold text-brand-700 hover:underline">
        {cta} →
      </Link>
    </div>
  );
}

function StatCard({ title, value, unit, href, cta }) {
  return (
    <div className="card flex flex-col">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 flex-1">
        <span className="text-3xl font-bold text-gray-900">{value}</span>{" "}
        <span className="text-sm text-gray-500">{unit}</span>
      </p>
      <Link href={href} className="mt-4 text-sm font-semibold text-brand-700 hover:underline">
        {cta} →
      </Link>
    </div>
  );
}
