export const metadata = {
  title: "Applications | BB Deco",
};

export default function ApplicationsPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/10 bg-white px-4 md:px-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 md:text-2xl">
            Applications
          </h1>
          <p className="text-xs text-gray-500 md:text-sm">
            Filter and review all admissions submissions
          </p>
        </div>
      </header>

      <main className="flex-1 bg-white p-4 md:p-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-dashed border-black/15 bg-gray-50/50 px-6 py-16 text-center">
          <p className="text-sm font-medium text-gray-900">
            Applications workspace
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Full list and filters will live here. Use the dashboard home for the
            live table for now.
          </p>
        </div>
      </main>
    </>
  );
}
