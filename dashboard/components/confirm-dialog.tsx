"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  variant = "primary",
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl"
      >
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "rounded-[var(--radius-sm)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[var(--bb-primary)] hover:bg-[var(--bb-primary-hover)]",
            )}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
