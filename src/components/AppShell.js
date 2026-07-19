"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Minimal inline icons (Lucide-style), 20x20, currentColor stroke.
const Icon = ({ d, filled }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d}
  </svg>
);
const icons = {
  home: <Icon d={<><path d="M3 10.5 12 4l9 6.5" /><path d="M5 9.5V20h14V9.5" /></>} />,
  matches: <Icon d={<><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>} />,
  funds: <Icon d={<><rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></>} />,
  roster: <Icon d={<><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 6.5a3 3 0 0 1 0 5.8M18 19a5.5 5.5 0 0 0-3-4.9" /></>} />,
  profile: <Icon d={<><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>} />,
  qr: <Icon d={<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3M20 20h.01M17 20h.01M20 17h.01" /></>} />,
  logout: <Icon d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>} />,
};

export default function AppShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = user.role === "admin";

  const nav = [
    { key: "home", label: "Home", href: "/" },
    { key: "matches", label: "Matches", href: "/matches" },
    { key: "funds", label: "Funds", href: "/funds" },
    ...(isAdmin ? [{ key: "roster", label: "Roster", href: "/players" }] : []),
    { key: "profile", label: "Profile", href: "/profile" },
    ...(isAdmin ? [{ key: "qr", label: "QR Library", href: "/qr-library" }] : []),
  ];
  const bottomKeys = isAdmin
    ? ["home", "matches", "funds", "roster"]
    : ["home", "matches", "funds", "profile"];
  const bottom = bottomKeys.map((k) => nav.find((n) => n.key === k));

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const initials = (user.fullName || user.username || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
          <span className="text-xl">⚽</span>
          <span className="font-bold tracking-tight">SINNO FC</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive(item.href)
                  ? "bg-brand-50 font-semibold text-brand-700"
                  : "font-medium text-gray-600 hover:bg-gray-50"
              }`}
            >
              {icons[item.key]}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            {icons.logout}
            Log out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col md:pl-60">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <span className="flex items-center gap-1.5 font-bold">
            <span>⚽</span> SINNO FC
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="/profile"
              aria-label="Profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
            >
              {initials}
            </Link>
            <button
              onClick={logout}
              aria-label="Log out"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            >
              {icons.logout}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-5 pb-24 md:px-8 md:py-8 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-gray-200 bg-white md:hidden">
        {bottom.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
              isActive(item.href) ? "text-brand-600" : "text-gray-400"
            }`}
          >
            {icons[item.key]}
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
