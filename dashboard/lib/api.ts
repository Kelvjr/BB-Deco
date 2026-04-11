export type ApplicationRow = {
  id?: number;
  full_name?: string | null;
  email?: string | null;
  program_applied?: string | null;
  created_at?: string | null;
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

export async function fetchApplications(): Promise<
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

  try {
    const res = await fetch(`${base}/applications`, { cache: "no-store" });
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
  return rows.map((row, index) => ({
    key: row.id ?? `${row.email ?? "row"}-${index}`,
    applicant: row.full_name?.trim() || "—",
    email: row.email?.trim() || "—",
    program: row.program_applied?.trim() || "—",
    status: "Submitted",
    submittedAt: formatSubmittedAt(row),
  }));
}
