"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_GROUPS, type NavGroup, type NavLeaf } from "@/lib/nav";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const COLLAPSE_KEY = "bbdeco_sidebar_collapsed";

type AdminProfile = {
  name: string;
  email?: string | null;
  imageUrl?: string | null;
};

function isLeafActive(pathname: string, leaf: NavLeaf): boolean {
  if (pathname === leaf.href) return true;
  if (leaf.href !== "/" && pathname.startsWith(leaf.href + "/")) return true;
  return false;
}

function isGroupActive(pathname: string, group: NavGroup): boolean {
  return group.children.some((c) => isLeafActive(pathname, c));
}

function GroupBlock({
  group,
  pathname,
  collapsed,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const active = isGroupActive(pathname, group);
  const [open, setOpen] = useState<boolean>(group.defaultOpen ?? active);
  const effectiveOpen = open || active;

  const Icon = group.icon;

  if (collapsed) {
    return (
      <CollapsedGroup
        group={group}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <Collapsible open={effectiveOpen} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "group/trigger flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
            active
              ? "text-[var(--bb-primary)]"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          )}
        >
          <Icon
            className={cn(
              "size-[18px] shrink-0",
              active ? "text-[var(--bb-primary)]" : "text-slate-400",
            )}
            strokeWidth={1.75}
          />
          <span className="flex-1 text-left tracking-tight">{group.label}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-slate-400 transition-transform",
              effectiveOpen ? "rotate-0" : "-rotate-90",
            )}
            strokeWidth={2}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1">
        <ul className="ml-[18px] mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
          {group.children.map((leaf) => {
            const leafActive = isLeafActive(pathname, leaf);
            const LeafIcon = leaf.icon;
            return (
              <li key={leaf.href}>
                <Link
                  href={leaf.href}
                  onClick={onNavigate}
                  className={cn(
                    "relative flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] font-medium transition-colors",
                    leafActive
                      ? "bg-[rgba(8,151,53,0.08)] text-[var(--bb-primary)]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  {leafActive ? (
                    <span
                      aria-hidden
                      className="absolute -left-[13px] top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-[var(--bb-primary)]"
                    />
                  ) : null}
                  {LeafIcon ? (
                    <LeafIcon className="size-[14px] shrink-0" strokeWidth={1.75} />
                  ) : null}
                  <span className="truncate">{leaf.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

function CollapsedGroup({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isGroupActive(pathname, group);
  const Icon = group.icon;
  const href = group.rootHref ?? group.children[0]?.href ?? "/";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          onClick={onNavigate}
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
            active
              ? "bg-[rgba(8,151,53,0.10)] text-[var(--bb-primary)]"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
          )}
          aria-label={group.label}
        >
          <Icon className="size-[18px]" strokeWidth={1.75} />
          {active ? (
            <span
              aria-hidden
              className="absolute right-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-[var(--bb-primary)]"
            />
          ) : null}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{group.label}</TooltipContent>
    </Tooltip>
  );
}

function BrandRow({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center border-b border-slate-200 bg-white",
        collapsed ? "justify-center px-2" : "justify-between pl-4 pr-2",
      )}
    >
      <Link
        href="/"
        onClick={onNavigate}
        className={cn(
          "flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90",
        )}
      >
        <Image
          src="/logo.svg"
          alt="BB Deco"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 object-contain"
          priority
        />
        {!collapsed ? (
          <span className="min-w-0 truncate text-[15px] font-semibold tracking-tight text-slate-900">
            BB Deco
          </span>
        ) : null}
      </Link>
      {!collapsed ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label="Collapse sidebar"
          className="size-8 text-slate-400 hover:text-slate-700"
        >
          <PanelLeftClose className="size-4" strokeWidth={1.75} />
        </Button>
      ) : null}
    </div>
  );
}

function ExpandFloatingButton({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute -right-3 top-20 z-20 hidden size-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 md:flex"
      aria-label="Expand sidebar"
    >
      <PanelLeftOpen className="size-3.5" strokeWidth={2} />
    </button>
  );
}

function ProfileFooter({
  profile,
  collapsed,
}: {
  profile: AdminProfile;
  collapsed: boolean;
}) {
  const initials = useMemo(() => {
    const parts = profile.name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "A";
  }, [profile.name]);

  if (collapsed) {
    return (
      <div className="flex shrink-0 items-center justify-center border-t border-slate-200 bg-white px-2 py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="size-9 ring-1 ring-slate-200">
              {profile.imageUrl ? (
                <AvatarImage src={profile.imageUrl} alt={profile.name} />
              ) : null}
              <AvatarFallback className="bg-[rgba(8,151,53,0.10)] text-[var(--bb-primary)] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="font-medium">{profile.name}</div>
            {profile.email ? (
              <div className="text-[11px] opacity-80">{profile.email}</div>
            ) : null}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-3 border-t border-slate-200 bg-white px-3 py-3">
      <Avatar className="size-9 ring-1 ring-slate-200">
        {profile.imageUrl ? (
          <AvatarImage src={profile.imageUrl} alt={profile.name} />
        ) : null}
        <AvatarFallback className="bg-[rgba(8,151,53,0.10)] text-[var(--bb-primary)] font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="truncate text-[13px] font-semibold text-slate-900">
          {profile.name}
        </div>
        <div className="truncate text-[11px] text-slate-500">
          {profile.email ?? "Administrator"}
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar({
  profile,
  onNavigate,
}: {
  profile: AdminProfile;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        data-collapsed={collapsed ? "true" : "false"}
        className={cn(
          "relative flex h-full flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ease-out",
          collapsed ? "w-[68px]" : "w-[252px] xl:w-[260px]",
        )}
      >
        <BrandRow
          collapsed={collapsed}
          onToggle={toggleCollapse}
          onNavigate={onNavigate}
        />

        {collapsed ? <ExpandFloatingButton onToggle={toggleCollapse} /> : null}

        <ScrollArea className="flex-1">
          <nav
            className={cn(
              "flex flex-col gap-1.5 py-3",
              collapsed ? "items-center px-2" : "px-3",
            )}
          >
            {!collapsed ? (
              <Link
                href="/students/add"
                onClick={onNavigate}
                className="mb-2 flex w-full items-center gap-2 rounded-lg bg-[var(--bb-primary)] px-3 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[var(--bb-primary-hover)]"
              >
                <Plus className="size-4" strokeWidth={2} />
                <span>Add Student</span>
              </Link>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/students/add"
                    onClick={onNavigate}
                    className="mb-2 flex size-10 items-center justify-center rounded-lg bg-[var(--bb-primary)] text-white shadow-sm transition-colors hover:bg-[var(--bb-primary-hover)]"
                    aria-label="Add Student"
                  >
                    <Plus className="size-4" strokeWidth={2} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Add Student</TooltipContent>
              </Tooltip>
            )}

            {NAV_GROUPS.map((group) => (
              <GroupBlock
                key={group.id}
                group={group}
                pathname={pathname}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </ScrollArea>

        <ProfileFooter profile={profile} collapsed={collapsed} />
      </aside>
    </TooltipProvider>
  );
}

export type { AdminProfile };
