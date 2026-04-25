"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Archive,
  BarChart3,
  BookOpen,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Settings,
  UserCog,
  Users,
  User,
  Wallet,
} from "lucide-react";

const COLLAPSE_KEY = "bbdeco_sidebar_collapsed";

function SectionLabel({
  children,
  collapsed,
}: {
  children: ReactNode;
  collapsed: boolean;
}) {
  if (collapsed) return null;
  return (
    <div className="px-2 pb-0.5 pt-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {children}
      </span>
    </div>
  );
}

function NavMain({
  href,
  icon,
  label,
  badge,
  active,
  collapsed,
  onNavigate,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  badge?: number;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
      className={`group flex w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-[13px] font-medium transition-all ${
        active
          ? "bg-[rgba(8,151,53,0.1)] text-[var(--bb-primary)] shadow-sm"
          : "text-[var(--foreground)] hover:bg-[var(--muted)]"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className={`flex size-[18px] shrink-0 items-center justify-center [&_svg]:size-[18px] ${
            active ? "text-[var(--bb-primary)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
          }`}
        >
          {icon}
        </span>
        {!collapsed ? <span className="truncate">{label}</span> : null}
      </span>
      {!collapsed && typeof badge === "number" ? (
        <span className="shrink-0 rounded-md bg-[var(--bb-primary)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white tabular-nums">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function NavMainCollapsible({
  href,
  icon,
  label,
  badge,
  active,
  collapsed,
  open,
  onToggle,
  onNavigate,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  badge?: number;
  active: boolean;
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  if (collapsed) {
    return (
      <NavMain
        href={href}
        icon={icon}
        label={label}
        badge={badge}
        active={active}
        collapsed
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div
      className={`group flex w-full items-center gap-1 rounded-[var(--radius-sm)] px-1 py-0.5 transition-colors ${
        active ? "bg-[rgba(8,151,53,0.08)]" : "hover:bg-[var(--muted)]"
      }`}
    >
      <Link
        href={href}
        onClick={onNavigate}
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[var(--radius-sm)] px-1.5 py-1.5 text-[13px] font-medium text-[var(--foreground)]"
      >
        <span
          className={`flex size-[18px] shrink-0 items-center justify-center [&_svg]:size-[18px] ${
            active ? "text-[var(--bb-primary)]" : "text-[var(--muted-foreground)]"
          }`}
        >
          {icon}
        </span>
        <span className="truncate">{label}</span>
        {typeof badge === "number" ? (
          <span className="ml-auto shrink-0 rounded-md bg-[var(--bb-primary)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white tabular-nums">
            {badge}
          </span>
        ) : null}
      </Link>
      <button
        type="button"
        onClick={onToggle}
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-white hover:text-[var(--foreground)]"
        aria-expanded={open}
        aria-label={`Toggle ${label} submenu`}
      >
        {open ? (
          <ChevronDown className="size-4" strokeWidth={1.75} />
        ) : (
          <ChevronRight className="size-4" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}

function NavSub({
  href,
  children,
  active,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`block rounded-md px-2 py-1.5 text-[12px] font-medium leading-snug transition-colors ${
        active
          ? "bg-[var(--muted)] text-[var(--bb-primary)]"
          : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </Link>
  );
}

function NavLeaf({
  href,
  icon,
  label,
  active,
  collapsed,
  onNavigate,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
      className={`group flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-[13px] font-medium transition-all ${
        active
          ? "bg-[rgba(8,151,53,0.1)] text-[var(--bb-primary)]"
          : "text-[var(--foreground)] hover:bg-[var(--muted)]"
      }`}
    >
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center [&_svg]:size-[18px] ${
          active ? "text-[var(--bb-primary)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
        }`}
      >
        {icon}
      </span>
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </Link>
  );
}

function SubStack({ children }: { children: ReactNode }) {
  return (
    <div className="mt-1 space-y-0.5 border-l border-[var(--border)] pl-3 ml-2.5">
      {children}
    </div>
  );
}

export function DashboardSidebar({
  applicationCount,
  administratorName,
  onNavigate,
}: {
  applicationCount: number;
  administratorName: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [applicationsOpen, setApplicationsOpen] = useState(true);
  const [studentsOpen, setStudentsOpen] = useState(true);

  const toggleCollapse = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const dash = pathname === "/";
  const apps = pathname.startsWith("/applications");
  const students = pathname.startsWith("/students");
  const showApplicationsSubmenu = !collapsed && (applicationsOpen || apps);
  const showStudentsSubmenu = !collapsed && (studentsOpen || students);

  const w = collapsed ? "w-[4.5rem]" : "w-[14rem] xl:w-[15.5rem]";

  return (
    <aside
      className={`flex h-full ${w} shrink-0 flex-col border-r border-slate-200 bg-white shadow-[var(--card-shadow)] transition-[width] duration-200 ease-out`}
    >
      <div className="flex h-14 shrink-0 items-stretch border-b border-slate-200 bg-white md:h-[3.75rem]">
        <Link
          href="/"
          onClick={onNavigate}
          className={`flex min-w-0 flex-1 items-center gap-2.5 transition-opacity hover:opacity-90 ${collapsed ? "justify-center px-2" : "pl-3 pr-2"}`}
        >
          <Image
            src="/logo.svg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-auto shrink-0 object-contain"
            priority
          />
          {!collapsed ? (
            <>
              <span className="min-w-0 truncate text-[15px] font-semibold tracking-tight text-slate-900">
                BB Deco
              </span>
            </>
          ) : null}
          <span className="sr-only">BB Deco — home</span>
        </Link>
        <button
          type="button"
          onClick={toggleCollapse}
          className="mr-2 flex size-8 shrink-0 items-center justify-center self-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" strokeWidth={1.75} />
          ) : (
            <PanelLeftClose className="size-4" strokeWidth={1.75} />
          )}
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        <div className="flex flex-col gap-1">
          <SectionLabel collapsed={collapsed}>Overview</SectionLabel>
          <NavMain
            href="/"
            icon={<LayoutDashboard strokeWidth={1.75} />}
            label="Dashboard"
            active={dash}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavMainCollapsible
            href="/applications/all"
            icon={<ClipboardList strokeWidth={1.75} />}
            label="Applications"
            badge={applicationCount}
            active={apps}
            collapsed={collapsed}
            open={applicationsOpen}
            onToggle={() => setApplicationsOpen((v) => !v)}
            onNavigate={onNavigate}
          />
          {showApplicationsSubmenu ? (
            <SubStack>
              <NavSub
                href="/applications/all"
                active={pathname === "/applications/all"}
                onNavigate={onNavigate}
              >
                All
              </NavSub>
              <NavSub
                href="/applications/approved"
                active={pathname === "/applications/approved"}
                onNavigate={onNavigate}
              >
                Approved
              </NavSub>
              <NavSub
                href="/applications/pending"
                active={pathname === "/applications/pending"}
                onNavigate={onNavigate}
              >
                Pending
              </NavSub>
              <NavSub
                href="/applications/rejected"
                active={pathname === "/applications/rejected"}
                onNavigate={onNavigate}
              >
                Rejected
              </NavSub>
            </SubStack>
          ) : null}

          <SectionLabel collapsed={collapsed}>People</SectionLabel>
          <NavMainCollapsible
            href="/students/all"
            icon={<Users strokeWidth={1.75} />}
            label="Students"
            active={students}
            collapsed={collapsed}
            open={studentsOpen}
            onToggle={() => setStudentsOpen((v) => !v)}
            onNavigate={onNavigate}
          />
          {showStudentsSubmenu ? (
            <SubStack>
              <NavSub
                href="/students/all"
                active={pathname === "/students/all"}
                onNavigate={onNavigate}
              >
                All students
              </NavSub>
              <NavSub
                href="/students/enrolled"
                active={pathname === "/students/enrolled"}
                onNavigate={onNavigate}
              >
                Enrolled
              </NavSub>
            </SubStack>
          ) : null}

          <SectionLabel collapsed={collapsed}>Operations</SectionLabel>
          <NavLeaf
            href="/payments"
            icon={<Wallet strokeWidth={1.75} />}
            label="Payments"
            active={pathname === "/payments"}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavLeaf
            href="/attendance"
            icon={<CalendarCheck strokeWidth={1.75} />}
            label="Attendance"
            active={pathname === "/attendance"}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavLeaf
            href="/classes-courses"
            icon={<BookOpen strokeWidth={1.75} />}
            label="Classes & courses"
            active={pathname === "/classes-courses"}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavLeaf
            href="/teachers-staff"
            icon={<UserCog strokeWidth={1.75} />}
            label="Teachers & staff"
            active={pathname === "/teachers-staff"}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />

          <SectionLabel collapsed={collapsed}>Insights</SectionLabel>
          <NavLeaf
            href="/documents"
            icon={<FolderOpen strokeWidth={1.75} />}
            label="Documents"
            active={pathname === "/documents"}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavLeaf
            href="/reports-analytics"
            icon={<BarChart3 strokeWidth={1.75} />}
            label="Reports"
            active={pathname === "/reports-analytics"}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />

          <SectionLabel collapsed={collapsed}>System</SectionLabel>
          <NavLeaf
            href="/activity-logs"
            icon={<ScrollText strokeWidth={1.75} />}
            label="Activity logs"
            active={pathname === "/activity-logs"}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavLeaf
            href="/archives"
            icon={<Archive strokeWidth={1.75} />}
            label="Archives"
            active={pathname === "/archives"}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavLeaf
            href="/settings"
            icon={<Settings strokeWidth={1.75} />}
            label="Settings"
            active={pathname === "/settings"}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </div>
      </nav>

      <div className="shrink-0 border-t border-[var(--border)] p-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--muted)]"
            aria-hidden
          >
            <User className="size-4 text-[var(--muted-foreground)]" strokeWidth={1.75} />
          </div>
          {!collapsed ? (
            <div className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[12px] font-semibold text-[var(--foreground)]">
                {administratorName}
              </span>
              <span className="block truncate text-[11px] text-[var(--muted-foreground)]">
                Administrator
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
