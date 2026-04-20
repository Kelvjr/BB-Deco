"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Bell, PanelLeft, Search } from "lucide-react";

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
  const router = useRouter();
  const title = titleForPath(pathname);
  const [searchQ, setSearchQ] = useState("");

  const onSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchQ.trim();
      if (q) {
        router.push(`/applications/all?q=${encodeURIComponent(q)}`);
      } else {
        router.push("/applications/all");
      }
    },
    [router, searchQ],
  );

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-4 md:h-[3.75rem] md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
          aria-label="Open menu"
        >
          <PanelLeft className="size-5" strokeWidth={1.75} />
        </button>
        <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
          {title}
        </h1>
      </div>

      <div className="flex min-w-0 shrink-0 items-center gap-2 md:gap-3">
        <form
          onSubmit={onSearchSubmit}
          className="min-w-0 flex-1 max-w-[11rem] sm:max-w-xs md:max-w-sm"
        >
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              strokeWidth={1.75}
            />
            <input
              type="search"
              name="q"
              placeholder="Search applications"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--bb-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(8,151,53,0.2)]"
              aria-label="Search applications"
            />
          </div>
        </form>

        <div className="h-8 w-px shrink-0 bg-slate-200" aria-hidden />

        <button
          type="button"
          className="relative flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--bb-accent)] ring-2 ring-white" />
        </button>

        <Link
          href="/settings"
          className="flex min-w-0 shrink-0 items-center gap-2 rounded-[var(--radius-sm)] py-1 pl-1 pr-2 transition-colors hover:bg-slate-100"
        >
          <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <Image
              src="/logo.svg"
              alt=""
              width={36}
              height={36}
              className="size-8 object-contain p-1"
            />
          </span>
          <span className="hidden min-w-0 text-left md:block">
            <span className="block truncate text-sm font-semibold leading-tight text-slate-900">
              Admin
            </span>
            <span className="block text-[11px] leading-tight text-slate-500">
              admin
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
