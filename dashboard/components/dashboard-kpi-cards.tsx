import { ClipboardList, Clock, UserPlus, XCircle } from "lucide-react";

export function DashboardKpiCards({
  totalApplications,
  pendingReview,
  approvedStudents,
  rejectedApplications,
}: {
  totalApplications: number;
  pendingReview: number;
  approvedStudents: number;
  rejectedApplications: number;
}) {
  const items = [
    {
      label: "Total applications",
      value: totalApplications,
      hint: "All time",
      icon: ClipboardList,
      accent: "bg-[rgba(8,151,53,0.1)] text-[var(--bb-primary)]",
    },
    {
      label: "Pending review",
      value: pendingReview,
      hint: "Awaiting decision",
      icon: Clock,
      accent: "bg-[var(--bb-accent-soft)] text-amber-800 dark:text-amber-200",
    },
    {
      label: "Approved students",
      value: approvedStudents,
      hint: "Records on file",
      icon: UserPlus,
      accent: "bg-[rgba(8,151,53,0.12)] text-[var(--bb-primary)]",
    },
    {
      label: "Rejected",
      value: rejectedApplications,
      hint: "Not admitted",
      icon: XCircle,
      accent: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--card-shadow)] transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-[var(--foreground)]">
                {item.value}
              </p>
              <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                {item.hint}
              </p>
            </div>
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] ${item.accent}`}
            >
              <item.icon className="size-5" strokeWidth={1.75} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
