import type { ApplicationRow, StudentRow } from "@/lib/api";

export type DateRangePeriod = "all" | "7d" | "30d" | "90d";

function normStatus(s: unknown): string {
  if (typeof s !== "string" || !s.trim()) return "pending";
  return s.trim().toLowerCase();
}

export function filterRowsByPeriod<T extends { created_at?: string | null }>(
  rows: T[],
  period: DateRangePeriod,
): T[] {
  if (period === "all") return rows;
  const now = Date.now();
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const ms = days * 24 * 60 * 60 * 1000;
  return rows.filter((r) => {
    const raw = r.created_at;
    if (typeof raw !== "string") return false;
    const t = new Date(raw).getTime();
    if (Number.isNaN(t)) return false;
    return now - t <= ms;
  });
}

/** Grouped bars: approved (primary) vs rejected (secondary) per time bucket. */
export function approvedRejectedSeries(
  apps: ApplicationRow[],
  period: DateRangePeriod,
): { label: string; approved: number; rejected: number }[] {
  const scoped = filterRowsByPeriod(apps, period);
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;

  if (period === "7d") {
    const days = 7;
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayMs = todayStart.getTime();
    const buckets = Array.from({ length: days }, (_, i) => {
      const d = new Date(todayMs - (days - 1 - i) * dayMs);
      return {
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        approved: 0,
        rejected: 0,
      };
    });
    for (const row of scoped) {
      const raw = row.created_at;
      if (typeof raw !== "string") continue;
      const t = new Date(raw).getTime();
      if (Number.isNaN(t)) continue;
      const day = new Date(t);
      day.setHours(0, 0, 0, 0);
      const diffDays = Math.round((todayMs - day.getTime()) / dayMs);
      if (diffDays < 0 || diffDays > days - 1) continue;
      const idx = days - 1 - diffDays;
      const st = normStatus(row.status);
      if (st === "approved") buckets[idx].approved++;
      else if (st === "rejected") buckets[idx].rejected++;
    }
    return buckets;
  }

  const weeks = period === "all" ? 8 : period === "30d" ? 5 : 13;
  const buckets = Array.from({ length: weeks }, () => ({
    label: "",
    approved: 0,
    rejected: 0,
  }));

  for (const row of scoped) {
    const raw = row.created_at;
    if (typeof raw !== "string") continue;
    const t = new Date(raw).getTime();
    if (Number.isNaN(t)) continue;
    const weeksAgo = Math.floor((now - t) / weekMs);
    if (weeksAgo < 0 || weeksAgo >= weeks) continue;
    const idx = weeks - 1 - weeksAgo;
    const st = normStatus(row.status);
    if (st === "approved") buckets[idx].approved++;
    else if (st === "rejected") buckets[idx].rejected++;
  }

  return buckets.map((b, i) => {
    const d = new Date(now - (weeks - 1 - i) * weekMs);
    return {
      ...b,
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    };
  });
}

export function kpiMetrics(
  apps: ApplicationRow[],
  students: StudentRow[],
  period: DateRangePeriod,
): {
  totalApplications: number;
  pendingReview: number;
  approvedStudents: number;
  rejected: number;
} {
  const appScoped = filterRowsByPeriod(apps, period);
  const studentScoped = filterRowsByPeriod(students, period);
  return {
    totalApplications: appScoped.length,
    pendingReview: appScoped.filter((r) =>
      ["pending", "submitted"].includes(normStatus(r.status)),
    ).length,
    approvedStudents: studentScoped.length,
    rejected: appScoped.filter((r) => normStatus(r.status) === "rejected")
      .length,
  };
}

/** Last 5 applications by date (from filtered set). */
export function recentApplications(
  apps: ApplicationRow[],
  period: DateRangePeriod,
  limit: number,
): ApplicationRow[] {
  const scoped = filterRowsByPeriod(apps, period);
  return [...scoped]
    .sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    })
    .slice(0, limit);
}
