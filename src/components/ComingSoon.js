export default function ComingSoon({ title, note }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
        🚧
      </div>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{note}</p>
      <span className="badge-gray mt-4">Coming soon</span>
    </div>
  );
}
