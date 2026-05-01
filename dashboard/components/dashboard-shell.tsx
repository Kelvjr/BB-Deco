"use client";

import { useCallback, useState, type ReactNode } from "react";
import {
  DashboardSidebar,
  type AdminProfile,
} from "@/components/dashboard-sidebar";
import { DashboardTopBar } from "@/components/dashboard-top-bar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function DashboardShell({
  applicationCount,
  profile,
  children,
}: {
  applicationCount: number;
  profile: AdminProfile;
  children: ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileNavOpen(false), []);
  const openMobile = useCallback(() => setMobileNavOpen(true), []);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--page-bg)] text-[var(--foreground)]">
      <div className="hidden h-full min-h-0 shrink-0 lg:flex">
        <DashboardSidebar profile={profile} onNavigate={closeMobile} />
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="w-[280px] max-w-[85vw] p-0 sm:w-[320px]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Browse the dashboard</SheetDescription>
          </SheetHeader>
          <DashboardSidebar profile={profile} onNavigate={closeMobile} />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DashboardTopBar
          applicationCount={applicationCount}
          onMenuClick={openMobile}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
