"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Hourglass,
} from "lucide-react";

import type {
  ApplicationRow,
  ProgramBreakdownRow,
  ProgramRow,
  StudentRow,
} from "@/lib/api";
import {
  type ChartPeriod,
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

const KPI_PERIODS: { id: DateRangePeriod; label: string }[] = [
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

/** Prefer GET /programs (`application_count`); append stats rows for program_applied values not in the catalog. */
function mergeProgramBreakdown(
  programsCatalog: ProgramRow[],
  statsFallback: ProgramBreakdownRow[],
): ProgramBreakdownRow[] {
  if (programsCatalog.length === 0) return statsFallback;

  const fromCatalog: ProgramBreakdownRow[] = [];
  const nameKeys = new Set<string>();
  for (const p of programsCatalog) {
    const name = typeof p.name === "string" ? p.name.trim() : "";
    if (!name) continue;
    fromCatalog.push({
      program: name,
      count: Math.max(0, Number(p.application_count ?? 0)),
    });
    nameKeys.add(name.toLowerCase());
  }

  const extras: ProgramBreakdownRow[] = [];
  for (const row of statsFallback) {
    const k = String(row.program ?? "").trim().toLowerCase();
    if (!k || nameKeys.has(k)) continue;
    extras.push({ program: row.program, count: row.count });
  }

  return [...fromCatalog, ...extras].sort((a, b) => b.count - a.count);
}

export function DashboardHomeClient({
  applications,
  students,
  programBreakdownFromApi,
  programsCatalog,
  streamEnrolled,
  streamApprenticeship,
  loadError,
  displayName,
}: {
  applications: ApplicationRow[];
  students: StudentRow[];
  /** From GET /stats/program-breakdown; used with client aggregation for non-catalog program names. */
  programBreakdownFromApi: ProgramBreakdownRow[];
  /** From GET /programs; drives program breakdown and filter options when non-empty. */
  programsCatalog: ProgramRow[];
  streamEnrolled: number;
  streamApprenticeship: number;
  loadError: string | null;
  displayName: string;
}) {
  const [kpiPeriod, setKpiPeriod] = useState<DateRangePeriod>("all");
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("30d");

  const kpis = useMemo(
    () => kpiMetrics(applications, students, kpiPeriod),
    [applications, students, kpiPeriod],
  );

  const allTimeKpis = useMemo(
    () => kpiMetrics(applications, students, "all"),
    [applications, students],
  );

  const triple = useMemo(
    () => applicationsTripleSeries(applications, chartPeriod),
    [applications, chartPeriod],
  );

  const statsFallback = useMemo(
    () =>
      programBreakdownFromApi.length > 0
        ? programBreakdownFromApi
        : programBreakdown(applications),
    [programBreakdownFromApi, applications],
  );

  const programs = useMemo(
    () => mergeProgramBreakdown(programsCatalog, statsFallback),
    [programsCatalog, statsFallback],
  );

  const activeProgramsCount = useMemo(
    () =>
      programsCatalog.filter(
        (p) => (String(p.status ?? "active").toLowerCase() || "active") === "active",
      ).length,
    [programsCatalog],
  );

  const programTableOptions = useMemo(
    () =>
      programsCatalog
        .map((p) => (typeof p.name === "string" ? p.name.trim() : ""))
        .filter(Boolean),
    [programsCatalog],
  );

  const programBreakdownDescription = useMemo(() => {
    if (programsCatalog.length === 0) return undefined;
    const n = activeProgramsCount;
    return `Catalog (${n} active program${n === 1 ? "" : "s"}) — counts match application “program” to program name`;
  }, [programsCatalog.length, activeProgramsCount]);

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
            KPI cards respect the range below. The chart has its own window (7 / 30 / 90 days).
          </p>
        </div>
        <div className="inline-flex h-9 flex-wrap items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
          {KPI_PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setKpiPeriod(p.id)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors sm:px-3 sm:text-[12px]",
                kpiPeriod === p.id
                  ? "bg-[var(--bb-primary)] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-4">
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
          value={kpisPeriodStudentCount(students, kpiPeriod)}
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

      <section>
        <QuickActionsGrid />
      </section>

      <section>
        <div>
          <ApplicationsBarChart
            data={triple}
            period={chartPeriod}
            onPeriodChange={setChartPeriod}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <StudentStreamDonut
            enrolled={streamEnrolled}
            apprenticeship={streamApprenticeship}
          />
        </div>
        <div className="lg:col-span-4">
          <ProgramBreakdownDonut
            data={programs}
            description={programBreakdownDescription}
          />
        </div>
        <div className="lg:col-span-3">
          <TodayActivity items={activity} />
        </div>
      </section>

      <section>
        <ApplicationsTablePremium
          rows={applications}
          programOptionsFromCatalog={programTableOptions}
        />
      </section>
    </div>
  );
}

function kpisPeriodStudentCount(
  students: StudentRow[],
  period: DateRangePeriod,
): number {
  if (period === "all") return students.length;
  const now = Date.now();
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const ms = days * 24 * 60 * 60 * 1000;
  return students.filter((r) => {
    const raw = r.created_at;
    if (typeof raw !== "string") return false;
    const t = new Date(raw).getTime();
    if (Number.isNaN(t)) return false;
    return now - t <= ms;
  }).length;
}
