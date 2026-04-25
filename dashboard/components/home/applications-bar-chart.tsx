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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DateRangePeriod } from "@/lib/stats";

type Datum = {
  label: string;
  applications: number;
  approved: number;
  rejected: number;
};

function periodDescription(period: DateRangePeriod): string {
  switch (period) {
    case "7d":
      return "Day-by-day for the last 7 days";
    case "30d":
      return "Weekly buckets for the last 30 days";
    case "90d":
      return "Weekly buckets for the last 90 days";
    default:
      return "Weekly buckets across recent activity";
  }
}

export function ApplicationsBarChart({
  data,
  period,
}: {
  data: Datum[];
  period: DateRangePeriod;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle>Applications over time</CardTitle>
          <CardDescription>{periodDescription(period)}</CardDescription>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-[rgba(8,151,53,0.10)] text-[var(--bb-primary)]">
          <TrendingUp className="size-[18px]" strokeWidth={1.75} />
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
