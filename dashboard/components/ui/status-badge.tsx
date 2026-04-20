import { cn } from "@/lib/cn";

export function StatusBadge({
  statusKey,
  label,
}: {
  statusKey: string;
  label: string;
}) {
  const s = statusKey.toLowerCase();
  const variant =
    s === "approved"
      ? "bg-[rgba(8,151,53,0.12)] text-[var(--bb-primary)] ring-1 ring-[rgba(8,151,53,0.25)]"
      : s === "rejected"
        ? "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900"
        : s === "pending" || s === "submitted"
          ? "bg-[var(--bb-accent-soft)] text-amber-800 ring-1 ring-amber-200/80 dark:text-amber-200"
          : "bg-[var(--muted)] text-[var(--muted-foreground)] ring-1 ring-[var(--border)]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        variant,
      )}
    >
      {label}
    </span>
  );
}
