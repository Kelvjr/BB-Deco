import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { fetchApplicationsCached } from "@/lib/api";

export const dynamic = "force-dynamic";

function normStatus(s: unknown): string {
  if (typeof s !== "string" || !s.trim()) return "pending";
  return s.trim().toLowerCase();
}

export default async function DashboardHomePage() {
  const result = await fetchApplicationsCached();
  const rows = result.ok ? result.data : [];
  const total = rows.length;
  const pendingReview = rows.filter((r) =>
    ["pending", "submitted"].includes(normStatus(r.status)),
  ).length;
  const approved = rows.filter((r) => normStatus(r.status) === "approved").length;
  const loadError = result.ok ? null : result.error;

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 bg-white px-4 md:px-6">
        <div>
          <h1 className="text-base font-semibold text-gray-900 md:text-lg">
            Admissions dashboard
          </h1>
          <p className="text-xs text-gray-500">
            Manage student applications and admissions activity
          </p>
        </div>

        <div className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-gray-500">
          Admin
        </div>
      </header>

      <main className="flex-1 bg-white p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-5">
          {loadError ? (
            <div
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
              role="alert"
            >
              <p className="font-medium">Could not load application counts</p>
              <p className="mt-1 text-amber-900/90">{loadError}</p>
            </div>
          ) : null}

          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Total applications</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                {total}
              </h2>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Pending review</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                {pendingReview}
              </h2>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Approved</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                {approved}
              </h2>
            </div>
          </section>

          <ApplicationsTableBlock />
        </div>
      </main>
    </>
  );
}
