"use client";

import { useEffect, useMemo, useState } from "react";
import { Inbox, Search } from "lucide-react";
import { ApplicationsTableBody } from "@/components/applications-table-body";
import type { ApplicationTableRowView } from "@/components/applications-table-body";

type FilterKey = "all" | "pending" | "approved" | "rejected";

export function ApplicationsListPanel({
  rows,
  loadError,
  title,
  description,
  defaultFilter = "all",
  mode = "full",
  initialSearch = "",
}: {
  rows: ApplicationTableRowView[];
  loadError: string | null;
  title: string;
  description: string;
  defaultFilter?: FilterKey;
  /** Compact = no search/filters (e.g. dashboard “recent”). */
  mode?: "full" | "compact";
  initialSearch?: string;
}) {
  const [q, setQ] = useState(initialSearch);
  const [filter, setFilter] = useState<FilterKey>(defaultFilter);

  useEffect(() => {
    setQ(initialSearch);
  }, [initialSearch]);

  const filtered = useMemo(() => {
    if (mode === "compact") return rows;
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all") {
        const sk = r.statusKey;
        if (filter === "pending" && sk !== "pending" && sk !== "submitted") {
          return false;
        }
        if (filter === "approved" && sk !== "approved") return false;
        if (filter === "rejected" && sk !== "rejected") return false;
      }
      if (!needle) return true;
      const hay = `${r.applicant} ${r.email} ${r.phone} ${r.program}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q, filter, mode]);

  return (
    <div className="space-y-4">
      {loadError ? (
        <div
          className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-medium">Could not load applications</p>
          <p className="mt-1 text-amber-900/90">{loadError}</p>
        </div>
      ) : null}

      <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--card-shadow)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
              {title}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {description}
            </p>
          </div>
          {mode === "full" ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="search"
                  placeholder="Search name, email, phone…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--background)] py-2.5 pl-10 pr-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--bb-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(8,151,53,0.25)]"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterKey)}
                className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm font-medium text-[var(--foreground)] focus:border-[var(--bb-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(8,151,53,0.25)]"
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          ) : null}
        </div>

        <div className="mt-5 overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--border)]">
          <table className="w-full min-w-[44rem] text-left">
            <thead className="bg-[var(--muted)]/80 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            {loadError ? (
              <tbody>
                <tr className="border-t border-[var(--border)]">
                  <td
                    className="px-4 py-8 text-sm text-[var(--muted-foreground)]"
                    colSpan={6}
                  >
                    Fix the configuration above, then refresh.
                  </td>
                </tr>
              </tbody>
            ) : filtered.length === 0 ? (
              <tbody>
                <tr className="border-t border-[var(--border)]">
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex size-14 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                        <Inbox className="size-7" strokeWidth={1.5} />
                      </div>
                      <p className="mt-4 text-base font-medium text-[var(--foreground)]">
                        {rows.length === 0
                          ? "No applications yet"
                          : "No matches"}
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        {rows.length === 0
                          ? "When applicants use the public form, they will appear here."
                          : "Try a different search or status filter."}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <ApplicationsTableBody rows={filtered} />
            )}
          </table>
        </div>
        {!loadError && filtered.length > 0 ? (
          <p className="mt-3 text-xs text-[var(--muted-foreground)]">
            Click a row to open full details.
          </p>
        ) : null}
      </section>
    </div>
  );
}
