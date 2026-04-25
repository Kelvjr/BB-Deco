"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Hourglass,
} from "lucide-react";

import type { ApplicationRow, StudentRow } from "@/lib/api";
import {
  type DateRangePeriod,
  applicationsTripleSeries,
  kpiMetrics,
  programBreakdown,
  recentActivity,
  sparklineSeries,
  trendPct,
} from "@/lib/stats";
import { cn } from "@/lib/utils";

import { ApplicationsBarChart } from "@/components/home/applications-bar-chart";
import { ApplicationsTablePremium } from "@/components/home/applications-table-premium";
import { HeroWelcome } from "@/components/home/hero-welcome";
import { KpiCard } from "@/components/home/kpi-card";
import { ProgramBreakdownDonut } from "@/components/home/program-breakdown-donut";
import { QuickActionsGrid } from "@/components/home/quick-actions-grid";
import { StudentStreamDonut } from "@/components/home/student-stream-donut";
import { TodayActivity } from "@/components/home/today-activity";

const PERIODS: { id: DateRangePeriod; label: string }[] = [
  { id: "all", label: "All time" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

function isPending(s: unknown): boolean {
  if (typeof s !== "string") return true;
  const x = s.trim().toLowerCase();
  return x === "" || x === "pending" || x === "submitted";
}

function isApproved(s: unknown): boolean {
  return typeof s === "string" && s.trim().toLowerCase() === "approved";
}

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
  const [period, setPeriod] = useState<DateRangePeriod>("30d");

  const kpis = useMemo(
    () => kpiMetrics(applications, students, period),
    [applications, students, period],
  );

  const allTimeKpis = useMemo(
    () => kpiMetrics(applications, students, "all"),
    [applications, students],
  );

  const triple = useMemo(
    () => applicationsTripleSeries(applications, period),
    [applications, period],
  );

  const programs = useMemo(
    () => programBreakdown(applications),
    [applications],
  );

  const activity = useMemo(() => recentActivity(applications, 6), [applications]);

  const sparkApps = useMemo(
    () => sparklineSeries(applications, 14),
    [applications],
  );
  const sparkApproved = useMemo(
    () => sparklineSeries(applications, 14, (r) => isApproved(r.status)),
    [applications],
  );
  const sparkPending = useMemo(
    () => sparklineSeries(applications, 14, (r) => isPending(r.status)),
    [applications],
  );
  const sparkStudents = useMemo(() => sparklineSeries(students, 14), [students]);

  const trendApps = trendPct(applications, 30);
  const trendApproved = trendPct(applications, 30, (r) => isApproved(r.status));
  const trendPending = trendPct(applications, 30, (r) => isPending(r.status));
  const trendStudents = trendPct(students, 30);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      {loadError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">Heads up:</span> {loadError}
        </div>
      ) : null}

      <HeroWelcome
        firstName={displayName}
        pendingCount={allTimeKpis.pendingReview}
        totalApplications={allTimeKpis.totalApplications}
      />

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Performance
          </h2>
          <p className="text-sm text-slate-500">
            Track admissions and student growth at a glance.
          </p>
        </div>
        <div className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
                period === p.id
                  ? "bg-[var(--bb-primary)] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total applications"
          value={kpis.totalApplications}
          trendPct={trendApps}
          trendLabel="vs prior 30 days"
          href="/admissions/all"
          icon={ClipboardList}
          spark={sparkApps}
          accent="primary"
        />
        <KpiCard
          label="Approved students"
          value={kpis.approvedStudents}
          trendPct={trendApproved}
          trendLabel="vs prior 30 days"
          href="/admissions/approved"
          icon={CheckCircle2}
          spark={sparkApproved}
          accent="primary"
        />
        <KpiCard
          label="Total students"
          value={students.length}
          trendPct={trendStudents}
          trendLabel="vs prior 30 days"
          href="/students/all"
          icon={GraduationCap}
          spark={sparkStudents}
          accent="blue"
        />
        <KpiCard
          label="Pending applications"
          value={kpis.pendingReview}
          trendPct={trendPending}
          trendLabel="vs prior 30 days"
          href="/admissions/pending"
          icon={Hourglass}
          spark={sparkPending}
          accent="amber"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ApplicationsBarChart data={triple} period={period} />
        </div>
        <div className="lg:col-span-4">
          <QuickActionsGrid />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <StudentStreamDonut
            enrolled={students.length}
            apprenticeship={0}
          />
        </div>
        <div className="lg:col-span-4">
          <ProgramBreakdownDonut data={programs} />
        </div>
        <div className="lg:col-span-3">
          <TodayActivity items={activity} />
        </div>
      </section>

      <section>
        <ApplicationsTablePremium rows={applications} />
      </section>
    </div>
  );
}
