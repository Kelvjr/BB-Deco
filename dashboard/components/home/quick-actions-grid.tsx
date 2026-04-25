"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardList,
  Megaphone,
  Plus,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Action = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
};

const ACTIONS: Action[] = [
  {
    label: "Add new student",
    description: "Create a record manually",
    href: "/students/add",
    icon: UserPlus,
    accent: "bg-[rgba(8,151,53,0.10)] text-[var(--bb-primary)]",
  },
  {
    label: "Review applications",
    description: "Open the pending queue",
    href: "/admissions/pending",
    icon: ClipboardList,
    accent: "bg-amber-50 text-amber-700",
  },
  {
    label: "Send announcement",
    description: "Broadcast to your school",
    href: "/communications/announcements",
    icon: Megaphone,
    accent: "bg-blue-50 text-blue-700",
  },
  {
    label: "Create program",
    description: "Add a course or track",
    href: "/programs/add",
    icon: Plus,
    accent: "bg-fuchsia-50 text-fuchsia-700",
  },
];

export function QuickActionsGrid() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump into common workflows</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  a.accent,
                )}
              >
                <a.icon className="size-[18px]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-slate-900">
                  {a.label}
                </div>
                <div className="text-[11px] text-slate-500">{a.description}</div>
              </div>
              <ArrowUpRight
                className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-[var(--bb-primary)]"
                strokeWidth={2}
              />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
