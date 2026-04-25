import { cache } from "react";
import { getBackendBaseUrl } from "./backend-url";

export type ApplicationRow = {
  id?: number | string;
  application_id?: number | string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  program_applied?: string | null;
  education_level?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
  submitted_at?: string | null;
  inserted_at?: string | null;
  links?: { self?: string; collection?: string };
  [key: string]: unknown;
};

export function resolveApiBase(): string | null {
  return getBackendBaseUrl();
}

/** Normalized status for filters and badges: pending | submitted | approved | rejected | … */
export function normalizeApplicationStatus(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "pending";
  return value.trim().toLowerCase();
}

export function formatStatusLabel(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "Pending review";
  const s = value.trim().toLowerCase();
  const labels: Record<string, string> = {
    pending: "Pending review",
    submitted: "Pending review",
    approved: "Approved",
    rejected: "Rejected",
  };
  return labels[s] ?? s.charAt(0).toUpperCase() + s.slice(1);
}

export async function fetchApplications(
  statusFilter?: string,
): Promise<
  | { ok: true; data: ApplicationRow[] }
  | { ok: false; error: string }
> {
  const base = resolveApiBase();
  if (!base) {
    return {
      ok: false,
      error:
        "API URL is not set. Add API_URL or NEXT_PUBLIC_API_URL (your Railway backend URL, no trailing slash) in Vercel project settings.",
    };
  }

  const allowed = ["pending", "approved", "rejected", "submitted"];
  const q =
    statusFilter &&
    allowed.includes(String(statusFilter).trim().toLowerCase())
      ? `?status=${encodeURIComponent(statusFilter.trim().toLowerCase())}`
      : "";

  try {
    const res = await fetch(`${base}/applications${q}`, { cache: "no-store" });
    const text = await res.text();
    let parsed: unknown = [];
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        return {
          ok: false,
          error: `Could not read applications (bad response, HTTP ${res.status}).`,
        };
      }
    }
    if (!res.ok) {
      const body = parsed as { error?: string; details?: string };
      return {
        ok: false,
        error: body.details || body.error || `HTTP ${res.status}`,
      };
    }
    if (!Array.isArray(parsed)) {
      return { ok: false, error: "Unexpected response from API." };
    }
    return { ok: true, data: parsed as ApplicationRow[] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return {
      ok: false,
      error:
        msg === "fetch failed"
          ? "Could not reach the API. Check API_URL and that the backend is running."
          : msg,
    };
  }
}

export async function fetchApplicationById(
  id: string,
): Promise<
  | { ok: true; data: ApplicationRow }
  | { ok: false; error: string; status: number }
> {
  const base = resolveApiBase();
  if (!base) {
    return {
      ok: false,
      error:
        "API URL is not set. Add API_URL or NEXT_PUBLIC_API_URL in Vercel project settings.",
      status: 503,
    };
  }

  const safeId = encodeURIComponent(id);
  try {
    const res = await fetch(`${base}/applications/${safeId}`, {
      cache: "no-store",
    });
    const text = await res.text();
    let parsed: unknown = {};
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        return {
          ok: false,
          error: `Invalid JSON from API (${res.status})`,
          status: res.status,
        };
      }
    }
    if (!res.ok) {
      const body = parsed as { error?: string };
      return {
        ok: false,
        error: body.error || `HTTP ${res.status}`,
        status: res.status,
      };
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: "Unexpected response from API.", status: 500 };
    }
    return { ok: true, data: parsed as ApplicationRow };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return { ok: false, error: msg, status: 503 };
  }
}

function formatSubmittedAt(row: ApplicationRow): string {
  const raw =
    (typeof row.created_at === "string" && row.created_at) ||
    (typeof row.submitted_at === "string" && row.submitted_at) ||
    (typeof row.inserted_at === "string" && row.inserted_at) ||
    "";
  if (!raw) return "—";
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? raw : d.toLocaleString();
}

/** Stable string for URLs (integer, bigint string, uuid, etc.). */
export function applicationLinkId(row: ApplicationRow): string | undefined {
  const candidates: unknown[] = [row.id, row.application_id];
  for (const c of candidates) {
    if (c == null) continue;
    if (typeof c === "bigint") return c.toString();
    const s = String(c).trim();
    if (s !== "") return s;
  }
  return undefined;
}

export function applicationTableRows(rows: ApplicationRow[]) {
  return rows.map((row, index) => {
    const linkId = applicationLinkId(row);
    const rawCreated =
      (typeof row.created_at === "string" && row.created_at) ||
      (typeof row.submitted_at === "string" && row.submitted_at) ||
      (typeof row.inserted_at === "string" && row.inserted_at) ||
      "";
    return {
      linkId,
      key: linkId ?? `${row.email ?? "row"}-${index}`,
      applicant: row.full_name?.trim() || "—",
      email: row.email?.trim() || "—",
      phone: row.phone?.trim() || "—",
      program: row.program_applied?.trim() || "—",
      status: formatStatusLabel(row.status),
      statusKey: normalizeApplicationStatus(row.status),
      submittedAt: formatSubmittedAt(row),
      submittedAtIso: rawCreated,
    };
  });
}

/** One in-flight fetch per request + status filter key. */
export const fetchApplicationsCached = cache(async (statusFilter?: string) =>
  fetchApplications(statusFilter),
);

export const fetchApplicationByIdCached = cache(async (id: string) =>
  fetchApplicationById(id),
);

export type StudentRow = {
  id?: string | number;
  student_number?: string | null;
  application_id?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  program_applied?: string | null;
  /** enrolled | apprenticeship */
  admission_type?: string | null;
  status?: string | null;
  profile_image?: string | null;
  notes?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
};

export async function fetchStudents(): Promise<
  | { ok: true; data: StudentRow[] }
  | { ok: false; error: string }
> {
  const base = resolveApiBase();
  if (!base) {
    return {
      ok: false,
      error:
        "API URL is not set. Add API_URL or NEXT_PUBLIC_API_URL (Railway backend URL) in Vercel project settings.",
    };
  }

  try {
    const res = await fetch(`${base}/students`, { cache: "no-store" });
    const text = await res.text();
    let parsed: unknown = [];
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        return {
          ok: false,
          error: `Could not read students (bad response, HTTP ${res.status}).`,
        };
      }
    }
    if (!res.ok) {
      const body = parsed as { error?: string; details?: string };
      return {
        ok: false,
        error: body.details || body.error || `HTTP ${res.status}`,
      };
    }
    if (!Array.isArray(parsed)) {
      return { ok: false, error: "Unexpected response from API." };
    }
    return { ok: true, data: parsed as StudentRow[] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return {
      ok: false,
      error:
        msg === "fetch failed"
          ? "Could not reach the API. Check API_URL and that the backend is running."
          : msg,
    };
  }
}

export type StudentTableRowView = {
  key: string;
  studentId: string;
  name: string;
  email: string;
  program: string;
  phone: string;
  joinedAt: string;
  admissionType: string;
  status: string;
};

export function studentTableRows(rows: StudentRow[]): StudentTableRowView[] {
  return rows.map((row, index) => {
    const key =
      (typeof row.id === "string" || typeof row.id === "number") &&
      String(row.id).trim() !== ""
        ? String(row.id)
        : `${row.student_number ?? "row"}-${index}`;
    const at = (row.admission_type ?? "enrolled").toLowerCase();
    const admissionLabel =
      at === "apprenticeship" ? "Apprenticeship" : "Enrolled";
    return {
      key,
      studentId: row.student_number?.trim() || "—",
      name: row.full_name?.trim() || "—",
      email: row.email?.trim() || "—",
      program: row.program_applied?.trim() || "—",
      phone: row.phone?.trim() || "—",
      joinedAt: formatSubmittedAt(row as ApplicationRow),
      admissionType: admissionLabel,
      status: (row.status ?? "active").trim() || "active",
    };
  });
}

export const fetchStudentsCached = cache(async () => fetchStudents());

export type ProgramBreakdownRow = { program: string; count: number };

export async function fetchProgramBreakdown(): Promise<
  | { ok: true; data: ProgramBreakdownRow[] }
  | { ok: false; error: string }
> {
  const base = resolveApiBase();
  if (!base) {
    return {
      ok: false,
      error: "API URL is not set.",
    };
  }
  try {
    const res = await fetch(`${base}/stats/program-breakdown`, {
      cache: "no-store",
    });
    const text = await res.text();
    let parsed: unknown = [];
    if (text) parsed = JSON.parse(text);
    if (!res.ok) {
      const body = parsed as { error?: string };
      return { ok: false, error: body.error || `HTTP ${res.status}` };
    }
    if (!Array.isArray(parsed)) {
      return { ok: false, error: "Unexpected response." };
    }
    const data = (parsed as { program?: string; count?: number }[]).map(
      (r) => ({
        program: String(r.program ?? "Unspecified"),
        count: Number(r.count ?? 0),
      }),
    );
    return { ok: true, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return { ok: false, error: msg };
  }
}

export const fetchProgramBreakdownCached = cache(async () =>
  fetchProgramBreakdown(),
);

export type ProgramRow = {
  id?: string;
  name?: string | null;
  duration?: string | null;
  description?: string | null;
  curriculum?: unknown;
  admission_requirements?: string | null;
  status?: string | null;
  application_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
};

export async function fetchPrograms(): Promise<
  | { ok: true; data: ProgramRow[] }
  | { ok: false; error: string }
> {
  const base = resolveApiBase();
  if (!base) return { ok: false, error: "API URL is not set." };
  try {
    const res = await fetch(`${base}/programs`, { cache: "no-store" });
    const text = await res.text();
    const parsed = text ? JSON.parse(text) : [];
    if (!res.ok) {
      const body = parsed as { error?: string };
      return { ok: false, error: body.error || `HTTP ${res.status}` };
    }
    if (!Array.isArray(parsed)) return { ok: false, error: "Unexpected response." };
    return { ok: true, data: parsed as ProgramRow[] };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Request failed",
    };
  }
}

export async function fetchProgramById(
  id: string,
): Promise<{ ok: true; data: ProgramRow } | { ok: false; error: string }> {
  const base = resolveApiBase();
  if (!base) return { ok: false, error: "API URL is not set." };
  try {
    const res = await fetch(`${base}/programs/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    const text = await res.text();
    const parsed = text ? JSON.parse(text) : {};
    if (!res.ok) {
      const body = parsed as { error?: string };
      return { ok: false, error: body.error || `HTTP ${res.status}` };
    }
    return { ok: true, data: parsed as ProgramRow };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Request failed",
    };
  }
}

export const fetchProgramsCached = cache(async () => fetchPrograms());

export async function fetchStudentById(
  id: string,
): Promise<
  | { ok: true; data: StudentRow }
  | { ok: false; error: string; status: number }
> {
  const base = resolveApiBase();
  if (!base) return { ok: false, error: "API URL is not set.", status: 503 };
  try {
    const res = await fetch(`${base}/students/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    const text = await res.text();
    const parsed = text ? JSON.parse(text) : {};
    if (!res.ok) {
      const body = parsed as { error?: string };
      return {
        ok: false,
        error: body.error || `HTTP ${res.status}`,
        status: res.status,
      };
    }
    return { ok: true, data: parsed as StudentRow };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Request failed",
      status: 503,
    };
  }
}

export const fetchStudentByIdCached = cache(async (id: string) =>
  fetchStudentById(id),
);
