import type { ApplicationRow } from "@/lib/api";

/** Last 8 weeks, oldest → newest (for left-to-right charts). */
export function weeklyApplicationCounts(
  rows: ApplicationRow[],
): { label: string; count: number }[] {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const counts = Array.from({ length: 8 }, () => 0);

  for (const row of rows) {
    const raw = row.created_at;
    if (typeof raw !== "string") continue;
    const t = new Date(raw).getTime();
    if (Number.isNaN(t)) continue;
    const weeksAgo = Math.floor((now - t) / weekMs);
    if (weeksAgo >= 0 && weeksAgo < 8) {
      counts[7 - weeksAgo]++;
    }
  }

  const labels = ["−7w", "−6w", "−5w", "−4w", "−3w", "−2w", "−1w", "This wk"];
  return counts.map((count, i) => ({
    label: labels[i] ?? `W${i + 1}`,
    count,
  }));
}
