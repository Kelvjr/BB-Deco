import type { ReactNode } from "react";

/** Page body: max width + padding. Page title lives in the top bar. */
export function WorkspaceShell({
  subtitle,
  children,
}: {
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:space-y-6 md:px-6 md:py-8 xl:px-8 xl:py-10">
      {subtitle ? (
        <p className="text-sm text-[var(--muted-foreground)]">{subtitle}</p>
      ) : null}
      {children ?? (
        <div className="rounded-[var(--radius)] border border-dashed border-[var(--border)] bg-[var(--muted)]/40 px-6 py-16 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            This area is ready to connect to your data and workflows.
          </p>
        </div>
      )}
    </div>
  );
}
