"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartPeriod } from "@/lib/stats";

type Datum = {
  label: string;
  applications: number;
  approved: number;
  rejected: number;
};

function periodDescription(period: ChartPeriod): string {
  switch (period) {
    case "7d":
      return "Day-by-day for the last 7 days";
    case "30d":
      return "Weekly buckets for the last 30 days";
    case "90d":
      return "Weekly buckets for the last 90 days";
    default:
      return "";
  }
}

const CHART_PERIODS: { id: ChartPeriod; label: string }[] = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

export function ApplicationsBarChart({
  data,
  period,
  onPeriodChange,
}: {
  data: Datum[];
  period: ChartPeriod;
  onPeriodChange: (p: ChartPeriod) => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-4 space-y-0 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <CardTitle>Applications over time</CardTitle>
          <CardDescription>{periodDescription(period)}</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="inline-flex h-9 flex-wrap items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {CHART_PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPeriodChange(p.id)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors sm:px-3 sm:text-[12px]",
                  period === p.id
                    ? "bg-[var(--bb-primary)] text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(8,151,53,0.10)] text-[var(--bb-primary)]">
            <TrendingUp className="size-[18px]" strokeWidth={1.75} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
              barCategoryGap="22%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(15,23,42,0.06)"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickMargin={8}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                width={40}
              />
              <Tooltip
                cursor={{ fill: "rgba(8,151,53,0.06)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(15,23,42,0.08)",
                  fontSize: 12,
                  boxShadow:
                    "0 8px 24px -8px rgba(15,23,42,0.12), 0 1px 3px rgba(15,23,42,0.06)",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                iconType="circle"
              />
              <Bar
                dataKey="applications"
                name="Applications"
                fill="#94a3b8"
                radius={[6, 6, 0, 0]}
                maxBarSize={22}
              />
              <Bar
                dataKey="approved"
                name="Approved"
                fill="#089735"
                radius={[6, 6, 0, 0]}
                maxBarSize={22}
              />
              <Bar
                dataKey="rejected"
                name="Rejected"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                maxBarSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
