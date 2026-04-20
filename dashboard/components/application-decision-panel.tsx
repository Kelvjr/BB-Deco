"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { cn } from "@/lib/cn";

const STATUSES = ["pending", "approved", "rejected", "submitted"] as const;

export function ApplicationDecisionPanel({
  applicationId,
  initialStatus,
}: {
  applicationId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus.toLowerCase());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState<null | "approve" | "reject">(null);

  async function patch(next: string) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const text = await res.text();
      let data: { error?: string; details?: string; status?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text) as typeof data;
        } catch {
          setMessage("Unexpected response from server.");
          return;
        }
      }
      if (!res.ok) {
        setMessage(
          data.details ||
            data.error ||
            `Update failed (${res.status}). Check API_URL on the dashboard.`,
        );
        return;
      }
      if (typeof data.status === "string" && data.status.trim()) {
        setStatus(data.status.trim().toLowerCase());
      }
      setMessage("Saved.");
      router.refresh();
    } catch {
      setMessage("Could not reach the dashboard API.");
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => setConfirm("approve")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--bb-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--bb-primary-hover)] disabled:opacity-50 sm:flex-none sm:min-w-[140px]"
          >
            <Check className="size-4" strokeWidth={2.25} />
            Approve
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setConfirm("reject")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 shadow-sm transition-all hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30 sm:flex-none sm:min-w-[140px]"
          >
            <X className="size-4" strokeWidth={2.25} />
            Reject
          </button>
        </div>

        <details className="group rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--muted)]/50 p-3">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
            More options (change status manually)
          </summary>
          <div className="mt-3 flex flex-col gap-3 border-t border-[var(--border)] pt-3 sm:flex-row sm:items-end">
            <label className="block text-xs font-medium text-[var(--muted-foreground)]">
              Admission status
              <select
                className="mt-1.5 block w-full min-w-[12rem] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => patch(status)}
              disabled={loading}
              className="rounded-[var(--radius-sm)] bg-[var(--bb-accent)] px-4 py-2 text-sm font-semibold text-amber-950 transition-opacity hover:opacity-95 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save status"}
            </button>
          </div>
        </details>

        {message ? (
          <p className="text-xs text-[var(--muted-foreground)]">{message}</p>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirm === "approve"}
        title="Approve this application?"
        description="The applicant will be marked as approved. If your system is set up for it, a student profile may be created automatically."
        confirmLabel="Yes, approve"
        variant="primary"
        loading={loading}
        onConfirm={() => patch("approved")}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "reject"}
        title="Reject this application?"
        description="The applicant will be marked as rejected. You can change this later from “More options” if needed."
        confirmLabel="Yes, reject"
        variant="danger"
        loading={loading}
        onConfirm={() => patch("rejected")}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}
