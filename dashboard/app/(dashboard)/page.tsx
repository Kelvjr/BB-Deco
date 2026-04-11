import {
  applicationTableRows,
  fetchApplicationsCached,
} from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const result = await fetchApplicationsCached();
  const applications = result.ok ? result.data : [];
  const rows = applicationTableRows(applications);
  const total = applications.length;
  const loadError = result.ok ? null : result.error;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/10 bg-white px-4 md:px-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 md:text-2xl">
            Admissions Dashboard
          </h1>
          <p className="text-xs text-gray-500 md:text-sm">
            Manage student applications and admissions activity
          </p>
        </div>

        <div className="rounded-full border border-black/10 px-4 py-2 text-sm text-gray-500">
          Admin
        </div>
      </header>

      <main className="flex-1 bg-white p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {loadError ? (
            <div
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
              role="alert"
            >
              <p className="font-medium">Could not load applications</p>
              <p className="mt-1 text-amber-900/90">{loadError}</p>
            </div>
          ) : null}

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Applications</p>
              <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                {total}
              </h2>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Pending Review</p>
              <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                {total}
              </h2>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Approved</p>
              <h2 className="mt-3 text-3xl font-semibold text-gray-900">0</h2>
            </div>
          </section>

          <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Applications
              </h2>
              <p className="text-sm text-gray-500">
                Submissions from the public apply form (live from API).
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-black/10">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-700">
                  <tr>
                    <th className="px-4 py-3 font-medium">Applicant</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Program</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {loadError ? (
                    <tr className="border-t border-black/10">
                      <td
                        className="px-4 py-4 text-sm text-gray-500"
                        colSpan={5}
                      >
                        Fix the configuration above, then refresh this page.
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr className="border-t border-black/10">
                      <td
                        className="px-4 py-4 text-sm text-gray-500"
                        colSpan={5}
                      >
                        No applications yet.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.key} className="border-t border-black/10">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {r.applicant}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {r.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {r.program}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {r.submittedAt}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
