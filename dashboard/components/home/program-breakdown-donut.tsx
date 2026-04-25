"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PALETTE = [
  "#089735",
  "#f59e0b",
  "#2563eb",
  "#c026d3",
  "#0891b2",
  "#dc2626",
  "#7c3aed",
  "#64748b",
];

export function ProgramBreakdownDonut({
  data,
}: {
  data: { program: string; count: number }[];
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const top = data.slice(0, 6);
  const otherSum = data.slice(6).reduce((sum, d) => sum + d.count, 0);
  const series = otherSum > 0 ? [...top, { program: "Other", count: otherSum }] : top;
  const hasData = total > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Program breakdown</CardTitle>
        <CardDescription>Applications per program</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={
                  hasData
                    ? series
                    : [{ program: "empty", count: 1 }]
                }
                dataKey="count"
                nameKey="program"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={76}
                paddingAngle={hasData ? 2 : 0}
                stroke="none"
                isAnimationActive={false}
              >
                {(hasData ? series : [{ program: "empty", count: 1 }]).map(
                  (d, i) => (
                    <Cell
                      key={d.program}
                      fill={hasData ? PALETTE[i % PALETTE.length] : "#e2e8f0"}
                    />
                  ),
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
              {total}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              Total
            </div>
          </div>
        </div>
        <ul className="mt-4 space-y-1.5">
          {series.slice(0, 4).map((d, i) => {
            const pct = total === 0 ? 0 : Math.round((d.count / total) * 100);
            return (
              <li
                key={d.program}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="truncate text-slate-700">{d.program}</span>
                </div>
                <span className="shrink-0 tabular-nums text-slate-500">
                  {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
