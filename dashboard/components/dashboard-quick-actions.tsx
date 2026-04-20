import Link from "next/link";
import { ArrowRight, ClipboardList, Megaphone, UserPlus } from "lucide-react";

export function DashboardQuickActions() {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--card-shadow)]">
      <h2 className="text-sm font-semibold text-[var(--foreground)]">
        Quick actions
      </h2>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
        Common tasks for admissions staff
      </p>
      <ul className="mt-4 space-y-2">
        <li>
          <Link
            href="/applications/pending"
            className="group flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--foreground)] transition-all hover:border-[rgba(8,151,53,0.35)] hover:bg-[rgba(8,151,53,0.04)]"
          >
            <span className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-[rgba(8,151,53,0.1)] text-[var(--bb-primary)]">
                <ClipboardList className="size-4" strokeWidth={1.75} />
              </span>
              Review applications
            </span>
            <ArrowRight className="size-4 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
        <li>
          <Link
            href="/students/all"
            className="group flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--foreground)] transition-all hover:border-[rgba(8,151,53,0.35)] hover:bg-[rgba(8,151,53,0.04)]"
          >
            <span className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-[rgba(245,158,11,0.15)] text-amber-800">
                <UserPlus className="size-4" strokeWidth={1.75} />
              </span>
              Add new student
            </span>
            <ArrowRight className="size-4 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="group flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--foreground)] transition-all hover:border-[rgba(8,151,53,0.35)] hover:bg-[rgba(8,151,53,0.04)]"
          >
            <span className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-slate-100 text-slate-700">
                <Megaphone className="size-4" strokeWidth={1.75} />
              </span>
              Send announcements
            </span>
            <ArrowRight className="size-4 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
