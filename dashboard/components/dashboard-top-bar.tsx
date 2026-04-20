"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Moon, PanelLeft, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

function titleForPath(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  const map: Record<string, string> = {
    "/applications/all": "Applications",
    "/applications/approved": "Approved applications",
    "/applications/pending": "Pending applications",
    "/applications/rejected": "Rejected applications",
    "/students/all": "Students",
    "/students/enrolled": "Enrolled students",
    "/students/apprenticeships": "Apprenticeships",
    "/students/graduated": "Graduated students",
    "/teachers-staff": "Teachers & staff",
    "/classes-courses": "Classes & courses",
    "/attendance": "Attendance",
    "/payments": "Payments",
    "/documents": "Documents",
    "/reports-analytics": "Reports & analytics",
    "/activity-logs": "Activity logs",
    "/archives": "Archives",
    "/settings": "Settings",
  };
  if (map[pathname]) return map[pathname];
  const appDetail = pathname.match(/^\/applications\/([^/]+)$/);
  if (appDetail && appDetail[1] && appDetail[1] !== "all") {
    return "Application details";
  }
  return "BB Deco";
}

export function DashboardTopBar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const pathname = usePathname();
  const title = titleForPath(pathname);
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur-md md:h-[3.75rem] md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] md:hidden"
          aria-label="Open menu"
        >
          <PanelLeft className="size-5" strokeWidth={1.75} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-[var(--foreground)] md:text-xl">
            {title}
          </h1>
          <p className="hidden text-xs text-[var(--muted-foreground)] sm:block">
            BB Deco Admissions
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 md:gap-2">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--bb-accent)] ring-2 ring-[var(--background)]" />
        </button>
        <button
          type="button"
          onClick={toggle}
          className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="size-[18px]" strokeWidth={1.75} />
          ) : (
            <Moon className="size-[18px]" strokeWidth={1.75} />
          )}
        </button>
        <Link
          href="/settings"
          className="flex items-center gap-2 rounded-[var(--radius-sm)] py-1 pl-1 pr-2 transition-colors hover:bg-[var(--muted)]"
        >
          <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--muted)]">
            <Image
              src="/logo.svg"
              alt=""
              width={36}
              height={36}
              className="size-8 object-contain p-1"
            />
          </span>
          <span className="hidden text-left text-xs leading-tight md:block">
            <span className="block font-medium text-[var(--foreground)]">
              Admin
            </span>
            <span className="text-[10px] text-[var(--muted-foreground)]">
              Staff
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
