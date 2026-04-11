"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  BarChart3,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  ScrollText,
  Settings,
  UserCog,
  Users,
  User,
  Wallet,
} from "lucide-react";

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2 pb-0.5 pt-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
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
}: {
  href: string;
  icon: ReactNode;
  label: string;
  badge?: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-emerald-50 text-emerald-800"
          : "text-gray-900 hover:bg-gray-50"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={`flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-3.5 ${
            active ? "text-emerald-800" : "text-gray-500"
          }`}
        >
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </span>
      {typeof badge === "number" ? (
        <span className="shrink-0 rounded-md bg-green-600 px-1 py-0.5 text-[10px] font-semibold leading-none text-white tabular-nums">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function NavSub({
  href,
  children,
  active,
}: {
  href: string;
  children: ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded px-1 py-0.5 text-[11px] font-medium leading-snug transition-colors ${
        active
          ? "text-emerald-800"
          : "text-gray-500 hover:text-gray-800"
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
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-emerald-50 text-emerald-800"
          : "text-gray-900 hover:bg-gray-50"
      }`}
    >
      <span
        className={`flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-3.5 ${
          active ? "text-emerald-800" : "text-gray-500"
        }`}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SubStack({ children }: { children: ReactNode }) {
  return (
    <div className="mt-0.5 space-y-0.5 border-l border-black/10 pl-2.5 ml-3.5">
      {children}
    </div>
  );
}

export function DashboardSidebar({
  applicationCount,
}: {
  applicationCount: number;
}) {
  const pathname = usePathname();

  const dash = pathname === "/";
  const apps = pathname.startsWith("/applications");
  const students = pathname.startsWith("/students");

  return (
    <aside className="hidden h-screen w-[15.5rem] shrink-0 flex-col border-r border-black/10 bg-white md:flex">
      <Link
        href="/"
        className="flex shrink-0 flex-col items-stretch border-b border-black/10 px-3 py-4 transition-opacity hover:opacity-90"
      >
        <Image
          src="/logo.svg"
          alt="BB Deco & Catering Training Centre"
          width={320}
          height={120}
          className="mx-auto h-16 w-full max-w-[13rem] object-contain object-center sm:h-[4.5rem]"
          priority
        />
        <span className="sr-only">BB Deco Catering — home</span>
      </Link>

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
        <div className="flex flex-col gap-3.5">
          <div>
            <SectionLabel>Overview</SectionLabel>
            <div className="mt-0.5 space-y-0.5">
              <NavMain
                href="/"
                icon={<LayoutDashboard strokeWidth={2} />}
                label="Dashboard"
                active={dash}
              />
              <NavMain
                href="/applications/all"
                icon={<ClipboardList strokeWidth={2} />}
                label="Applications"
                badge={applicationCount}
                active={apps}
              />
              <SubStack>
                <NavSub
                  href="/applications/all"
                  active={pathname === "/applications/all"}
                >
                  All applications
                </NavSub>
                <NavSub
                  href="/applications/approved"
                  active={pathname === "/applications/approved"}
                >
                  Approved
                </NavSub>
                <NavSub
                  href="/applications/pending"
                  active={pathname === "/applications/pending"}
                >
                  Pending
                </NavSub>
                <NavSub
                  href="/applications/rejected"
                  active={pathname === "/applications/rejected"}
                >
                  Rejected
                </NavSub>
              </SubStack>
            </div>
          </div>

          <div>
            <SectionLabel>Management</SectionLabel>
            <div className="mt-0.5 space-y-0.5">
              <NavMain
                href="/students/all"
                icon={<Users strokeWidth={2} />}
                label="Students"
                active={students}
              />
              <SubStack>
                <NavSub
                  href="/students/all"
                  active={pathname === "/students/all"}
                >
                  All students
                </NavSub>
                <NavSub
                  href="/students/enrolled"
                  active={pathname === "/students/enrolled"}
                >
                  Enrolled
                </NavSub>
                <NavSub
                  href="/students/apprenticeships"
                  active={pathname === "/students/apprenticeships"}
                >
                  Apprenticeships
                </NavSub>
                <NavSub
                  href="/students/graduated"
                  active={pathname === "/students/graduated"}
                >
                  Graduated
                </NavSub>
              </SubStack>

              <NavLeaf
                href="/teachers-staff"
                icon={<UserCog strokeWidth={2} />}
                label="Teachers & staff"
                active={pathname === "/teachers-staff"}
              />
              <NavLeaf
                href="/classes-courses"
                icon={<BookOpen strokeWidth={2} />}
                label="Classes & courses"
                active={pathname === "/classes-courses"}
              />
              <NavLeaf
                href="/attendance"
                icon={<CalendarCheck strokeWidth={2} />}
                label="Attendance"
                active={pathname === "/attendance"}
              />
            </div>
          </div>

          <div>
            <SectionLabel>Operations</SectionLabel>
            <div className="mt-0.5 space-y-0.5">
              <NavLeaf
                href="/payments"
                icon={<Wallet strokeWidth={2} />}
                label="Payments"
                active={pathname === "/payments"}
              />
              <NavLeaf
                href="/documents"
                icon={<FolderOpen strokeWidth={2} />}
                label="Documents"
                active={pathname === "/documents"}
              />
              <NavLeaf
                href="/reports-analytics"
                icon={<BarChart3 strokeWidth={2} />}
                label="Reports & analytics"
                active={pathname === "/reports-analytics"}
              />
            </div>
          </div>

          <div>
            <SectionLabel>System</SectionLabel>
            <div className="mt-0.5 space-y-0.5">
              <NavLeaf
                href="/activity-logs"
                icon={<ScrollText strokeWidth={2} />}
                label="Activity logs"
                active={pathname === "/activity-logs"}
              />
              <NavLeaf
                href="/archives"
                icon={<Archive strokeWidth={2} />}
                label="Archives"
                active={pathname === "/archives"}
              />
              <NavLeaf
                href="/settings"
                icon={<Settings strokeWidth={2} />}
                label="Settings"
                active={pathname === "/settings"}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="shrink-0 border-t border-black/10 p-2.5">
        <div className="flex items-center gap-2">
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-gray-50"
            aria-hidden
          >
            <User className="size-4 text-gray-500" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex flex-col leading-tight">
            <span className="truncate text-[11px] font-semibold text-gray-900">
              Sarah Jenkins
            </span>
            <span className="truncate text-[10px] font-normal text-gray-500">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
