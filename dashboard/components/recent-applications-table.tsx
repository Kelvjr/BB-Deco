"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ApplicationTableRowView } from "@/components/applications-table-body";

function dateApplied(row: ApplicationTableRowView): string {
  const iso = row.submittedAtIso?.trim();
  if (iso) {
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }
  const fallback = row.submittedAt?.trim();
  if (!fallback || fallback === "—") return "—";
  const d = new Date(fallback);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return fallback;
}

export function RecentApplicationsTable({
  rows,
}: {
  rows: ApplicationTableRowView[];
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-[var(--radius-sm)] border border-dashed border-[var(--border)] bg-[var(--muted)]/50 px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
        No applications in this period.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            <th className="px-4 py-3">Applicant</th>
            <th className="px-4 py-3">Applied program</th>
            <th className="px-4 py-3">Date applied</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const href = r.linkId
              ? `/applications/${encodeURIComponent(r.linkId)}`
              : null;
            return (
              <tr
                key={r.key}
                className="border-t border-[var(--border)] transition-colors hover:bg-[rgba(8,151,53,0.04)]"
              >
                <td className="px-4 py-3 font-semibold text-[var(--foreground)]">
                  {r.applicant}
                </td>
                <td className="max-w-[12rem] truncate px-4 py-3 text-[var(--foreground)]">
                  {r.program}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--muted-foreground)]">
                  {dateApplied(r)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge statusKey={r.statusKey} label={r.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {href ? (
                    <Link
                      href={href}
                      className="inline-flex rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-semibold text-[var(--bb-primary)] transition-colors hover:bg-[rgba(8,151,53,0.1)]"
                    >
                      View
                    </Link>
                  ) : (
                    <span className="text-xs text-[var(--muted-foreground)]">
                      —
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
