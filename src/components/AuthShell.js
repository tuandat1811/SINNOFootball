// Centered card frame for the logged-out screens (login / register / setup).
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl shadow-sm">
            ⚽
          </div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="card">{children}</div>
        {footer && <div className="mt-5 text-center text-sm text-gray-500">{footer}</div>}
      </div>
    </main>
  );
}
