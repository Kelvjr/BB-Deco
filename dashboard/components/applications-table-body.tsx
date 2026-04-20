"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

export type ApplicationTableRowView = {
  key: string;
  linkId?: string;
  applicant: string;
  email: string;
  phone: string;
  program: string;
  status: string;
  statusKey: string;
  submittedAt: string;
};

export function ApplicationsTableBody({
  rows,
}: {
  rows: ApplicationTableRowView[];
}) {
  const router = useRouter();

  return (
    <tbody>
      {rows.map((r) => {
        const href = r.linkId
          ? `/applications/${encodeURIComponent(r.linkId)}`
          : null;
        return (
          <tr
            key={r.key}
            onClick={() => {
              if (href) router.push(href);
            }}
            onKeyDown={(e) => {
              if (!href) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(href);
              }
            }}
            tabIndex={href ? 0 : undefined}
            role={href ? "link" : undefined}
            aria-label={href ? `View application ${r.applicant}` : undefined}
            className={`group border-t border-[var(--border)] transition-colors ${
              href
                ? "cursor-pointer hover:bg-[rgba(8,151,53,0.06)] focus-visible:bg-[rgba(8,151,53,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--bb-primary)] dark:hover:bg-[rgba(8,151,53,0.1)]"
                : ""
            }`}
          >
            <td className="px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                {r.applicant}
                {href ? (
                  <ChevronRight className="size-4 shrink-0 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
                ) : null}
              </span>
            </td>
            <td className="max-w-[10rem] truncate px-4 py-3 text-sm text-[var(--muted-foreground)]">
              {r.email}
            </td>
            <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
              {r.phone}
            </td>
            <td className="max-w-[10rem] truncate px-4 py-3 text-sm text-[var(--foreground)]">
              {r.program}
            </td>
            <td className="px-4 py-3">
              <StatusBadge statusKey={r.statusKey} label={r.status} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--muted-foreground)]">
              {r.submittedAt}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
