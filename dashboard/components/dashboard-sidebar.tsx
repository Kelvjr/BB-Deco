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
  ChevronDown,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  ScrollText,
  Settings,
  UserCog,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

const AVATAR_SRC =
  "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=144&h=144&dpr=2";

type NavItemProps = {
  href: string;
  icon: ReactNode;
  label: string;
  badge?: number;
  trailing?: ReactNode;
  active?: boolean;
};

function NavRow({
  href,
  icon,
  label,
  badge,
  trailing,
  active,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={`inline-flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors ${
        active
          ? "bg-emerald-50 text-emerald-800"
          : "text-gray-900 hover:bg-gray-50"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <span
          className={`flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_svg]:shrink-0 ${
            active ? "text-emerald-800" : "text-gray-500"
          }`}
        >
          {icon}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </span>
      {typeof badge === "number" ? (
        <span className="rounded-xl bg-green-600 px-1.5 py-0.5 text-xs font-semibold text-white tabular-nums">
          {badge}
        </span>
      ) : (
        trailing
      )}
    </Link>
  );
}

function NavButtonRow({
  icon,
  label,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-gray-900 transition-colors hover:bg-gray-50"
    >
      <span className="flex items-center gap-2.5">
        <span className="flex size-4 shrink-0 items-center justify-center text-gray-500 [&_svg]:size-4">
          {icon}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </span>
      {trailing}
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col pb-2 pl-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {children}
      </span>
    </div>
  );
}

export function DashboardSidebar({
  applicationCount,
}: {
  applicationCount: number;
}) {
  const pathname = usePathname();
  const isDashboard = pathname === "/";

  return (
    <aside className="hidden w-64 shrink-0 flex-col self-stretch border-r border-black/10 bg-white md:flex">
      <div className="flex h-16 min-h-16 items-center gap-3 border-b border-black/10 px-6">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-600 shadow-[0px_2px_4px_0px_rgba(16,185,129,0.20)]">
          <UtensilsCrossed className="size-4 text-white" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex flex-col">
          <span className="truncate text-base font-semibold text-gray-900">
            BB Deco Catering
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-8 overflow-y-auto overflow-x-hidden px-4 py-6">
        <div className="flex flex-col gap-1">
          <SectionLabel>Overview</SectionLabel>

          <Link
            href="/"
            className={`inline-flex items-center gap-2.5 rounded-md px-3 py-2 transition-colors ${
              isDashboard
                ? "bg-emerald-50 text-emerald-800"
                : "text-gray-900 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard
              className={`size-4 shrink-0 ${isDashboard ? "text-emerald-800" : "text-gray-500"}`}
              strokeWidth={2}
            />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          <NavRow
            href="/applications"
            icon={<ClipboardList strokeWidth={2} />}
            label="Applications"
            badge={applicationCount}
            active={pathname === "/applications"}
          />

          <div className="flex flex-col pb-2 pl-7 pt-1">
            <div className="flex flex-col gap-3 border-l border-black/10 pl-3">
              <Link
                href="/applications"
                className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-800"
              >
                All Applications
              </Link>
              <Link
                href="/applications?status=pending"
                className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-800"
              >
                Pending
              </Link>
              <Link
                href="/applications?status=approved"
                className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-800"
              >
                Approved
              </Link>
            </div>
          </div>

          <NavButtonRow
            icon={<Users strokeWidth={2} />}
            label="Students"
            trailing={
              <ChevronDown className="size-4 shrink-0 text-gray-500" />
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <SectionLabel>Management</SectionLabel>

          <NavButtonRow
            icon={<UserCog strokeWidth={2} />}
            label="Teachers & Staff"
          />
          <NavButtonRow
            icon={<BookOpen strokeWidth={2} />}
            label="Classes & Courses"
          />
          <NavButtonRow
            icon={<CalendarCheck strokeWidth={2} />}
            label="Attendance"
          />
          <NavButtonRow
            icon={<Wallet strokeWidth={2} />}
            label="Payments"
          />
          <NavButtonRow
            icon={<FolderOpen strokeWidth={2} />}
            label="Documents"
          />
        </div>

        <div className="flex flex-col gap-1">
          <SectionLabel>System</SectionLabel>

          <NavButtonRow
            icon={<BarChart3 strokeWidth={2} />}
            label="Reports & Analytics"
          />
          <NavButtonRow
            icon={<ScrollText strokeWidth={2} />}
            label="Activity Logs"
          />
          <NavButtonRow icon={<Archive strokeWidth={2} />} label="Archives" />
          <NavButtonRow
            icon={<Settings strokeWidth={2} />}
            label="Settings"
          />
        </div>
      </div>

      <div className="flex flex-col border-t border-black/10 p-4">
        <div className="flex items-center gap-2.5">
          <Image
            src={AVATAR_SRC}
            alt="Profile"
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-2xl border border-black/10 object-cover"
          />
          <div className="min-w-0 flex flex-col">
            <span className="truncate text-xs font-semibold text-gray-900">
              Sarah Jenkins
            </span>
            <span className="truncate text-xs font-normal text-gray-500">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
