import { cache } from "react";

export type ApplicationRow = {
  id?: number;
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
  links?: { self?: string; collection?: string };
  [key: string]: unknown;
};

export function resolveApiBase(): string | null {
  const raw =
    process.env.API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:4000";
  }
  return null;
}

function formatStatusLabel(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "Pending";
  const s = value.trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
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

export function applicationTableRows(rows: ApplicationRow[]) {
  return rows.map((row, index) => {
    const idNum =
      row.id != null && !Number.isNaN(Number(row.id)) ? Number(row.id) : undefined;
    return {
      id: idNum,
      key: String(row.id ?? `${row.email ?? "row"}-${index}`),
      applicant: row.full_name?.trim() || "—",
      email: row.email?.trim() || "—",
      program: row.program_applied?.trim() || "—",
      status: formatStatusLabel(row.status),
      submittedAt: formatSubmittedAt(row),
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
