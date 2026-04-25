import type { ProgramBreakdownRow, ProgramRow } from "@/lib/api";
import { PROGRAM_CATALOG } from "@/lib/program-options";

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function countForName(name: string, breakdown: ProgramBreakdownRow[]): number {
  const n = norm(name);
  for (const row of breakdown) {
    if (norm(row.program) === n) return row.count;
  }
  return 0;
}

export type ProgramListEntry = {
  name: string;
  id?: string;
  inDatabase: boolean;
  applicationCount: number;
  duration: string | null;
  description: string | null;
  status: string | null;
  catalogOrder: number;
};

/**
 * All catalog programs first (fixed order), then any extra rows from the API not in the catalog.
 */
export function buildProgramsList(
  programs: ProgramRow[],
  breakdown: ProgramBreakdownRow[],
): ProgramListEntry[] {
  const byName = new Map<string, ProgramRow>();
  for (const p of programs) {
    const name = p.name?.trim();
    if (name) byName.set(norm(name), p);
  }

  const catalogKey = new Set(PROGRAM_CATALOG.map((c) => norm(c)));
  const out: ProgramListEntry[] = [];

  let order = 0;
  for (const catalogName of PROGRAM_CATALOG) {
    const row = byName.get(norm(catalogName));
    const appCount =
      row != null && typeof row.application_count === "number"
        ? row.application_count
        : countForName(catalogName, breakdown);
    out.push({
      name: catalogName,
      id: row?.id != null ? String(row.id) : undefined,
      inDatabase: row != null,
      applicationCount: appCount,
      duration: row?.duration != null ? String(row.duration) : null,
      description: row?.description != null ? String(row.description) : null,
      status: row?.status != null ? String(row.status) : "active",
      catalogOrder: order++,
    });
  }

  const extra: ProgramListEntry[] = [];
  for (const p of programs) {
    const name = p.name?.trim();
    if (!name) continue;
    if (catalogKey.has(norm(name))) continue;
    extra.push({
      name,
      id: p.id != null ? String(p.id) : undefined,
      inDatabase: true,
      applicationCount:
        typeof p.application_count === "number"
          ? p.application_count
          : countForName(name, breakdown),
      duration: p.duration != null ? String(p.duration) : null,
      description: p.description != null ? String(p.description) : null,
      status: p.status != null ? String(p.status) : "active",
      catalogOrder: 1000,
    });
  }
  extra.sort((a, b) => a.name.localeCompare(b.name));
  return [...out, ...extra];
}
