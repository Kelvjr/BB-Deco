"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  ChevronRight,
  Megaphone,
  PanelLeft,
  Plus,
  Search,
  UserPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { findGroupForPath, findLeafForPath, titleForPath } from "@/lib/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  GlobalCommandPalette,
  useCommandPalette,
} from "@/components/global-command-palette";

export function DashboardTopBar({
  applicationCount,
  onMenuClick,
}: {
  applicationCount: number;
  onMenuClick?: () => void;
}) {
  const pathname = usePathname();
  const palette = useCommandPalette();
  const [notifOpen, setNotifOpen] = useState(false);

  const group = findGroupForPath(pathname);
  const leaf = findLeafForPath(pathname);

  const sectionLabel = group?.label ?? "Dashboard";
  const pageLabel = leaf?.label ?? titleForPath(pathname);
  const sectionHref = group?.rootHref ?? "/";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/70 md:px-6",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
          aria-label="Open menu"
        >
          <PanelLeft className="size-5" strokeWidth={1.75} />
        </Button>

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5"
        >
          <Link
            href={sectionHref}
            className="hidden truncate text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 sm:inline"
          >
            {sectionLabel}
          </Link>
          {pageLabel !== sectionLabel ? (
            <>
              <ChevronRight
                className="hidden size-3.5 text-slate-300 sm:inline"
                strokeWidth={2}
              />
              <h1 className="truncate text-[15px] font-semibold tracking-tight text-slate-900">
                {pageLabel}
              </h1>
            </>
          ) : (
            <h1 className="truncate text-[15px] font-semibold tracking-tight text-slate-900 sm:hidden">
              {pageLabel}
            </h1>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={() => palette.setOpen(true)}
            className="hidden h-9 w-[280px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-left text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:inline-flex xl:w-[340px]"
          >
            <Search className="size-4" strokeWidth={1.75} />
            <span className="flex-1 truncate">Search anywhere…</span>
            <kbd className="hidden items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-500 xl:inline-flex">
              <span>⌘</span>K
            </kbd>
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => palette.setOpen(true)}
            className="lg:hidden"
            aria-label="Search"
          >
            <Search className="size-[18px]" strokeWidth={1.75} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="h-9 px-3 text-[13px]"
              >
                <Plus className="size-4" strokeWidth={2} />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Create new</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/students/add">
                  <UserPlus />
                  Add Student
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/programs/add">
                  <Plus />
                  Create Program
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/communications/announcements">
                  <Megaphone />
                  Send Announcement
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Notifications"
              >
                <Bell className="size-[18px]" strokeWidth={1.75} />
                {applicationCount > 0 ? (
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-[var(--bb-accent)] ring-2 ring-white" />
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Notifications
                  </div>
                  <div className="text-xs text-slate-500">
                    Updates on admissions activity
                  </div>
                </div>
                <Badge variant="soft">{applicationCount}</Badge>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {applicationCount > 0 ? (
                  <Link
                    href="/admissions/pending"
                    onClick={() => setNotifOpen(false)}
                    className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50"
                  >
                    <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(8,151,53,0.10)] text-[var(--bb-primary)]">
                      <Bell className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-900">
                        {applicationCount} application
                        {applicationCount === 1 ? "" : "s"} to review
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        Open the admissions queue to triage submissions.
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="px-4 py-10 text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <Bell className="size-5" strokeWidth={1.5} />
                    </div>
                    <div className="mt-3 text-sm font-medium text-slate-700">
                      You&rsquo;re all caught up
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      We&rsquo;ll alert you when something needs attention.
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <div className="ml-1 flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-8 ring-1 ring-slate-200",
                },
              }}
            />
          </div>
        </div>
      </header>

      <GlobalCommandPalette
        open={palette.open}
        onOpenChange={palette.setOpen}
      />
    </>
  );
}
