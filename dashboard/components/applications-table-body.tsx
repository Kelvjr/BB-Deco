"use client";

import { useRouter } from "next/navigation";

export type ApplicationTableRowView = {
  key: string;
  linkId?: string;
  applicant: string;
  email: string;
  program: string;
  status: string;
  submittedAt: string;
};

export function ApplicationsTableBody({ rows }: { rows: ApplicationTableRowView[] }) {
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
            className={`border-t border-black/10 ${
              href
                ? "cursor-pointer hover:bg-emerald-50/60 focus-visible:bg-emerald-50/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-600"
                : ""
            }`}
          >
            <td className="px-3 py-2 text-xs font-medium md:px-4 md:py-3 md:text-sm">
              <span
                className={
                  href
                    ? "text-emerald-800 underline decoration-emerald-800/40 underline-offset-2"
                    : "text-gray-900"
                }
              >
                {r.applicant}
              </span>
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
              {href ? (
                <span className="font-medium text-emerald-800 underline">
                  Open
                </span>
              ) : (
                "—"
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
