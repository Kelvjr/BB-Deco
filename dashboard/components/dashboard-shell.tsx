"use client";

import { useCallback, useState, type ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardTopBar } from "@/components/dashboard-top-bar";

export function DashboardShell({
  applicationCount,
  children,
}: {
  applicationCount: number;
  children: ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--page-bg)] text-[var(--foreground)]">
      {/* Mobile overlay */}
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(17rem,92vw)] max-w-full transform transition-transform duration-200 ease-out md:static md:z-auto md:flex md:w-auto md:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <DashboardSidebar
          applicationCount={applicationCount}
          onNavigate={closeMobile}
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DashboardTopBar onMenuClick={() => setMobileNavOpen(true)} />
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
