"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ENROLLED_COLOR = "#089735";
const APPRENTICE_COLOR = "#f59e0b";

export function StudentStreamDonut({
  enrolled,
  apprenticeship,
}: {
  enrolled: number;
  apprenticeship: number;
}) {
  const total = enrolled + apprenticeship;
  const data = [
    { name: "Enrolled", value: enrolled || 0, color: ENROLLED_COLOR },
    {
      name: "Apprenticeship",
      value: apprenticeship || 0,
      color: APPRENTICE_COLOR,
    },
  ];
  const hasData = total > 0;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle>Student streams</CardTitle>
          <CardDescription>Enrolled vs apprenticeship</CardDescription>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="About student streams"
              >
                <Info className="size-4" strokeWidth={1.75} />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="max-w-xs whitespace-normal text-left"
            >
              Apprenticeship classification will appear once the backend tracks
              admission type.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="relative h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={hasData ? data : [{ name: "empty", value: 1, color: "#e2e8f0" }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={84}
                paddingAngle={hasData ? 3 : 0}
                stroke="none"
                isAnimationActive={false}
              >
                {(hasData
                  ? data
                  : [{ name: "empty", value: 1, color: "#e2e8f0" }]
                ).map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
              {total}
            </div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Students
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((d) => (
            <div
              key={d.name}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="text-xs font-medium text-slate-600">
                  {d.name}
                </span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-slate-900">
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
