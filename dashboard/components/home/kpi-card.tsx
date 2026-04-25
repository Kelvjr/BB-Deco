"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  trendPct,
  trendLabel,
  href,
  icon: Icon,
  spark,
  accent = "primary",
}: {
  label: string;
  value: number;
  trendPct: number;
  trendLabel: string;
  href: string;
  icon: LucideIcon;
  spark: { i: number; v: number }[];
  accent?: "primary" | "amber" | "blue" | "rose";
}) {
  const isUp = trendPct >= 0;
  const accentMap = {
    primary: {
      bg: "bg-[rgba(8,151,53,0.10)]",
      text: "text-[var(--bb-primary)]",
      stroke: "#089735",
      fill: "rgba(8,151,53,0.18)",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      stroke: "#f59e0b",
      fill: "rgba(245,158,11,0.18)",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      stroke: "#2563eb",
      fill: "rgba(37,99,235,0.18)",
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      stroke: "#e11d48",
      fill: "rgba(225,29,72,0.18)",
    },
  } as const;
  const a = accentMap[accent];
  const gradId = `spark-${accent}-${label.replace(/\s+/g, "")}`;

  return (
    <Link href={href} className="group block">
      <Card className="gap-0 overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between p-5">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
              {value.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
                  isUp
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700",
                )}
              >
                {isUp ? (
                  <ArrowUpRight className="size-3" strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight className="size-3" strokeWidth={2.5} />
                )}
                {Math.abs(trendPct)}%
              </span>
              <span className="text-[11px] text-slate-500">{trendLabel}</span>
            </div>
          </div>
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              a.bg,
              a.text,
            )}
          >
            <Icon className="size-5" strokeWidth={1.75} />
          </div>
        </div>
        <div className="h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={spark}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={a.stroke} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={a.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={a.stroke}
                strokeWidth={2}
                fill={`url(#${gradId})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </Link>
  );
}
