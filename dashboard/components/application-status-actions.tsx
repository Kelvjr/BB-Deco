"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["pending", "approved", "rejected", "submitted"] as const;

export function ApplicationStatusActions({
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

  async function handleSave() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
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
            `Update failed (${res.status}). Is API_URL set on Vercel?`,
        );
        return;
      }
      if (typeof data.status === "string" && data.status.trim()) {
        setStatus(data.status.trim().toLowerCase());
      }
      setMessage("Saved.");
      router.refresh();
    } catch {
      setMessage("Could not reach the dashboard API route.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-black/10 bg-gray-50/50 p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="block text-xs font-medium text-gray-500">
        Admission status
        <select
          className="mt-1 block w-full min-w-[10rem] rounded-md border border-black/15 bg-white px-2 py-1.5 text-sm text-gray-900 sm:w-auto"
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
        onClick={handleSave}
        disabled={loading}
        className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Update status"}
      </button>
      {message ? (
        <span className="text-xs text-gray-600 sm:pb-2">{message}</span>
      ) : null}
    </div>
  );
}
