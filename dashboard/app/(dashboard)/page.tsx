import Link from "next/link";
import { ApplicationsChart } from "@/components/applications-chart";
import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { DashboardKpiCards } from "@/components/dashboard-kpi-cards";
import { DashboardQuickActions } from "@/components/dashboard-quick-actions";
import { fetchApplicationsCached, fetchStudentsCached } from "@/lib/api";
import { weeklyApplicationCounts } from "@/lib/stats";

export const dynamic = "force-dynamic";

function normStatus(s: unknown): string {
  if (typeof s !== "string" || !s.trim()) return "pending";
  return s.trim().toLowerCase();
}

export default async function DashboardHomePage() {
  const [appsResult, studentsResult] = await Promise.all([
    fetchApplicationsCached(),
    fetchStudentsCached(),
  ]);

  const rows = appsResult.ok ? appsResult.data : [];
  const total = rows.length;
  const pendingReview = rows.filter((r) =>
    ["pending", "submitted"].includes(normStatus(r.status)),
  ).length;
  const rejected = rows.filter((r) => normStatus(r.status) === "rejected").length;
  const studentCount = studentsResult.ok ? studentsResult.data.length : 0;
  const loadError = appsResult.ok ? null : appsResult.error;

  const weekly = weeklyApplicationCounts(rows);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--bb-primary)]">
            BB Deco Admissions
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            Welcome back
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Review new applications, track decisions, and manage enrolled students
            from one place.
          </p>
        </div>
        <Link
          href="/applications/pending"
          className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--bb-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
        >
          Review pending
        </Link>
      </div>

      {loadError ? (
        <div
          className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
          role="alert"
        >
          <p className="font-medium">Could not load application counts</p>
          <p className="mt-1 text-amber-900/90 dark:text-amber-200/90">
            {loadError}
          </p>
        </div>
      ) : null}

      <DashboardKpiCards
        totalApplications={total}
        pendingReview={pendingReview}
        approvedStudents={studentCount}
        rejectedApplications={rejected}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ApplicationsChart data={weekly} />
        </div>
        <div className="lg:col-span-1">
          <DashboardQuickActions />
        </div>
      </div>

      <ApplicationsTableBlock
        title="Recent applications"
        description="Latest five submissions. Open the full list for search and filters."
        limit={5}
      />
    </div>
  );
}
