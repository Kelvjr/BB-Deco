"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ClipboardList, Clock, Eye, Plus, UserPlus, XCircle } from "lucide-react";
import { ApplicationsChart } from "@/components/applications-chart";
import { DashboardQuickActions } from "@/components/dashboard-quick-actions";
import { RecentApplicationsTable } from "@/components/recent-applications-table";
import type { ApplicationRow, StudentRow } from "@/lib/api";
import { applicationTableRows } from "@/lib/api";
import {
  approvedRejectedSeries,
  type DateRangePeriod,
  kpiMetrics,
  recentApplications,
} from "@/lib/stats";

const PERIODS: { id: DateRangePeriod; label: string }[] = [
  { id: "all", label: "All" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

export function DashboardHomeClient({
  applications,
  students,
  loadError,
  displayName,
}: {
  applications: ApplicationRow[];
  students: StudentRow[];
  loadError: string | null;
  displayName: string;
}) {
  const [period, setPeriod] = useState<DateRangePeriod>("all");

  const kpis = useMemo(
    () => kpiMetrics(applications, students, period),
    [applications, students, period],
  );

  const chartData = useMemo(
    () => approvedRejectedSeries(applications, period),
    [applications, period],
  );

  const recentRows = useMemo(() => {
    const recent = recentApplications(applications, period, 5);
    return applicationTableRows(recent);
  }, [applications, period]);

  const kpiItems = [
    {
      label: "Total applications",
      value: kpis.totalApplications,
      hint: "In selected range",
      icon: ClipboardList,
      accent: "bg-[rgba(8,151,53,0.1)] text-[var(--bb-primary)]",
    },
    {
      label: "Pending review",
      value: kpis.pendingReview,
      hint: "Awaiting decision",
      icon: Clock,
      accent: "bg-[var(--bb-accent-soft)] text-amber-800",
    },
    {
      label: "Approved students",
      value: kpis.approvedStudents,
      hint: "Records in range",
      icon: UserPlus,
      accent: "bg-[rgba(8,151,53,0.12)] text-[var(--bb-primary)]",
    },
    {
      label: "Rejected",
      value: kpis.rejected,
      hint: "Not admitted",
      icon: XCircle,
      accent: "bg-red-50 text-red-700",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            Welcome back, {displayName}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Here&apos;s what&apos;s happening with admissions today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/applications/all"
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-sm transition-colors hover:bg-[var(--muted)]"
          >
            <Eye className="size-4" strokeWidth={1.75} />
            View all
          </Link>
          <Link
            href="/students/all"
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--bb-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
          >
            <Plus className="size-4" strokeWidth={1.75} />
            Add student
          </Link>
        </div>
      </div>

      {loadError ? (
        <div
          className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-medium">Could not load application counts</p>
          <p className="mt-1 text-amber-900/90">{loadError}</p>
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Metrics period
          </p>
          <div className="flex flex-wrap gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white p-1">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  period === p.id
                    ? "bg-[var(--bb-primary)] text-white shadow-sm"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiItems.map((item) => (
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ApplicationsChart data={chartData} period={period} />
        </div>
        <div className="lg:col-span-1">
          <DashboardQuickActions />
        </div>
      </div>

      <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--card-shadow)]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            Recent applications
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Latest submissions in the selected period (up to five).
          </p>
        </div>
        <RecentApplicationsTable rows={recentRows} />
      </section>
    </div>
  );
}
