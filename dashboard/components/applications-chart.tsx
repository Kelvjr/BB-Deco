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
import type { DateRangePeriod } from "@/lib/stats";

const COLOR_APPROVED = "#089735";
const COLOR_REJECTED = "#64748b";

function periodDescription(period: DateRangePeriod): string {
  switch (period) {
    case "7d":
      return "Approved vs rejected by day (last 7 days).";
    case "30d":
      return "Approved vs rejected by week (last 30 days).";
    case "90d":
      return "Approved vs rejected by week (last 90 days).";
    default:
      return "Approved vs rejected by week (last 8 weeks).";
  }
}

export function ApplicationsChart({
  data,
  period,
}: {
  data: { label: string; approved: number; rejected: number }[];
  period: DateRangePeriod;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--card-shadow)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Applications over time
          </h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {periodDescription(period)}
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] bg-[rgba(8,151,53,0.1)] text-[var(--bb-primary)]">
          <TrendingUp className="size-4" strokeWidth={1.75} />
        </div>
      </div>
      <div className="mt-4 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15,23,42,0.08)" />
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
              width={36}
            />
            <Tooltip
              cursor={{ fill: "rgba(8,151,53,0.06)" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid rgba(15,23,42,0.08)",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar
              dataKey="approved"
              name="Approved"
              fill={COLOR_APPROVED}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="rejected"
              name="Rejected"
              fill={COLOR_REJECTED}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
