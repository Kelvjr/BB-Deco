import Link from "next/link";
import {
  applicationTableRows,
  fetchApplicationsCached,
} from "@/lib/api";

export async function ApplicationsTableBlock({
  title = "Recent applications",
  description = "Submissions from the public apply form (live from API).",
  statusFilter,
}: {
  title?: string;
  description?: string;
  /** When set, calls GET /applications?status=… */
  statusFilter?: "pending" | "approved" | "rejected" | "submitted";
}) {
  const result = await fetchApplicationsCached(statusFilter);
  const applications = result.ok ? result.data : [];
  const rows = applicationTableRows(applications);
  const loadError = result.ok ? null : result.error;

  return (
    <div className="space-y-4">
      {loadError ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-medium">Could not load applications</p>
          <p className="mt-1 text-amber-900/90">{loadError}</p>
        </div>
      ) : null}

      <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm md:p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">{description}</p>
        </div>

        <div className="mt-4 overflow-x-auto overflow-y-hidden rounded-xl border border-black/10">
          <table className="w-full min-w-[36rem] text-left">
            <thead className="bg-gray-50 text-xs text-gray-700 md:text-sm">
              <tr>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">
                  Applicant
                </th>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">Email</th>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">
                  Program
                </th>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">
                  Status
                </th>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">
                  Submitted
                </th>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {loadError ? (
                <tr className="border-t border-black/10">
                  <td
                    className="px-3 py-3 text-xs text-gray-500 md:px-4 md:text-sm"
                    colSpan={6}
                  >
                    Fix the configuration above, then refresh this page.
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr className="border-t border-black/10">
                  <td
                    className="px-3 py-3 text-xs text-gray-500 md:px-4 md:text-sm"
                    colSpan={6}
                  >
                    No applications in this view.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.key} className="border-t border-black/10">
                    <td className="px-3 py-2 text-xs font-medium md:px-4 md:py-3 md:text-sm">
                      {r.id != null ? (
                        <Link
                          href={`/applications/${r.id}`}
                          className="text-emerald-800 underline decoration-emerald-800/30 underline-offset-2 hover:decoration-emerald-800"
                        >
                          {r.applicant}
                        </Link>
                      ) : (
                        r.applicant
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500 md:px-4 md:py-3 md:text-sm">
                      {r.email}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900 md:px-4 md:py-3 md:text-sm">
                      {r.program}
                    </td>
                    <td className="px-3 py-2 text-xs md:px-4 md:py-3 md:text-sm">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 md:text-xs">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500 md:px-4 md:py-3 md:text-sm">
                      {r.submittedAt}
                    </td>
                    <td className="px-3 py-2 text-xs md:px-4 md:py-3 md:text-sm">
                      {r.id != null ? (
                        <Link
                          href={`/applications/${r.id}`}
                          className="font-medium text-emerald-800 hover:underline"
                        >
                          Open
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
