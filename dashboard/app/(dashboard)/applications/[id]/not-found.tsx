import Link from "next/link";

export default function ApplicationNotFound() {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center border-b border-black/10 bg-white px-4 md:px-6">
        <h1 className="text-base font-semibold text-gray-900">Not found</h1>
      </header>
      <main className="flex-1 bg-white p-4 md:p-6">
        <p className="text-sm text-gray-600">
          No application exists at this link.
        </p>
        <p className="mt-4 text-sm">
          <Link
            href="/applications/all"
            className="font-medium text-emerald-800 underline"
          >
            All applications
          </Link>
        </p>
      </main>
    </>
  );
}
