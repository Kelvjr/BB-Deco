"use client";

import { TrendingUp } from "lucide-react";

export function ApplicationsChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--card-shadow)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Applications over time
          </h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Submissions in the last eight weeks
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] bg-[rgba(8,151,53,0.1)] text-[var(--bb-primary)]">
          <TrendingUp className="size-4" strokeWidth={1.75} />
        </div>
      </div>
      <div className="mt-6 flex h-44 items-end gap-1.5 sm:gap-2">
        {data.map((d) => {
          const h = Math.round((d.count / max) * 100);
          return (
            <div
              key={d.label}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-36 w-full flex-col justify-end">
                <div
                  className="w-full min-h-[4px] rounded-t-md bg-gradient-to-t from-[var(--bb-primary)] to-[#34d399] transition-all duration-300"
                  style={{ height: `${Math.max(8, h)}%` }}
                  title={`${d.count} in ${d.label}`}
                />
              </div>
              <span className="truncate text-[10px] font-medium text-[var(--muted-foreground)] sm:text-[11px]">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
