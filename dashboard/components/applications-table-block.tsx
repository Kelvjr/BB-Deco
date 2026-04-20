import {
  applicationTableRows,
  fetchApplicationsCached,
} from "@/lib/api";
import { ApplicationsListPanel } from "@/components/applications-list-panel";

type DefaultFilter = "all" | "pending" | "approved" | "rejected";

export async function ApplicationsTableBlock({
  title = "Recent applications",
  description = "Submissions from the public apply form (live from API).",
  statusFilter,
  limit,
  defaultFilter,
  mode = "full",
  initialSearch = "",
}: {
  title?: string;
  description?: string;
  /** When set, calls GET /applications?status=… */
  statusFilter?: "pending" | "approved" | "rejected" | "submitted";
  /** Max rows (e.g. dashboard recent list). */
  limit?: number;
  defaultFilter?: DefaultFilter;
  mode?: "full" | "compact";
  /** Prefill search from URL `?q=` (applications list). */
  initialSearch?: string;
}) {
  const result = await fetchApplicationsCached(statusFilter);
  const applications = result.ok ? result.data : [];
  const rows = applicationTableRows(applications);
  const loadError = result.ok ? null : result.error;

  const sliced = typeof limit === "number" ? rows.slice(0, limit) : rows;
  const effectiveMode = limit ? "compact" : mode;

  const df: DefaultFilter =
    defaultFilter ??
    (statusFilter === "pending"
      ? "pending"
      : statusFilter === "approved"
        ? "approved"
        : statusFilter === "rejected"
          ? "rejected"
          : "all");

  return (
    <ApplicationsListPanel
      rows={sliced}
      loadError={loadError}
      title={title}
      description={description}
      defaultFilter={df}
      mode={effectiveMode}
      initialSearch={initialSearch}
    />
  );
}
