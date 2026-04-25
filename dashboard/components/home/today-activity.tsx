"use client";

import Link from "next/link";
import { Check, Clock, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ActivityItem } from "@/lib/stats";

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

const KIND_STYLES = {
  approved: {
    icon: Check,
    chip: "bg-[rgba(8,151,53,0.10)] text-[var(--bb-primary)]",
    dot: "bg-[var(--bb-primary)]",
  },
  rejected: {
    icon: X,
    chip: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
  submitted: {
    icon: Sparkles,
    chip: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  pending: {
    icon: Clock,
    chip: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
} as const;

export function TodayActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Today at BB Deco</CardTitle>
        <CardDescription>Latest admissions activity</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Sparkles className="size-5" strokeWidth={1.5} />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">
              No recent activity
            </p>
            <p className="mt-1 text-xs text-slate-500">
              New submissions will appear here.
            </p>
          </div>
        ) : (
          <ol className="relative space-y-4 border-l border-slate-200 pl-4">
            {items.map((item) => {
              const style = KIND_STYLES[item.kind];
              const Icon = style.icon;
              const Body = (
                <>
                  <span
                    className={cn(
                      "absolute -left-[7px] mt-1 size-3 rounded-full ring-4 ring-white",
                      style.dot,
                    )}
                  />
                  <div className="flex items-start gap-2">
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-md",
                        style.chip,
                      )}
                    >
                      <Icon className="size-3.5" strokeWidth={2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium leading-tight text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {timeAgo(item.at)}
                      </p>
                    </div>
                  </div>
                </>
              );
              return (
                <li key={item.id} className="relative">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="block rounded-md transition-colors hover:bg-slate-50/80"
                    >
                      {Body}
                    </Link>
                  ) : (
                    Body
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
