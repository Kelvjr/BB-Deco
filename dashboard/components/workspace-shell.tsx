import type { ReactNode } from "react";

export function WorkspaceShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 bg-white px-4 md:px-6">
        <div>
          <h1 className="text-base font-semibold text-gray-900 md:text-lg">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-xs text-gray-500">{subtitle}</p>
          ) : null}
        </div>
      </header>
      <main className="flex-1 bg-white p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          {children ?? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-gray-50/40 px-6 py-14 text-center">
              <p className="text-sm text-gray-600">
                This area is ready to connect to your data and workflows.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
