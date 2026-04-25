"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpDown,
  Filter,
  Inbox,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { applicationTableRows, type ApplicationRow } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StatusKey = "all" | "pending" | "approved" | "rejected";
type SortKey = "newest" | "oldest";

const STATUS_PILL = {
  approved: "bg-[rgba(8,151,53,0.10)] text-[var(--bb-primary)]",
  rejected: "bg-rose-50 text-rose-700",
  pending: "bg-amber-50 text-amber-700",
  submitted: "bg-amber-50 text-amber-700",
} as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function ApplicationsTablePremium({
  rows,
  programOptionsFromCatalog = [],
}: {
  rows: ApplicationRow[];
  /** Program names from GET /programs; unioned with values present on applications. */
  programOptionsFromCatalog?: string[];
}) {
  const [tab, setTab] = useState<StatusKey>("all");
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState<string>("__all");
  const [sort, setSort] = useState<SortKey>("newest");

  const all = useMemo(() => applicationTableRows(rows), [rows]);

  const programs = useMemo(() => {
    const set = new Set<string>();
    for (const p of programOptionsFromCatalog) {
      const t = p?.trim();
      if (t) set.add(t);
    }
    for (const r of all) if (r.program && r.program !== "—") set.add(r.program);
    return [...set].sort();
  }, [all, programOptionsFromCatalog]);

  const filtered = useMemo(() => {
    let result = all;
    if (tab !== "all") {
      result = result.filter((r) => {
        if (tab === "pending")
          return r.statusKey === "pending" || r.statusKey === "submitted";
        return r.statusKey === tab;
      });
    }
    if (program !== "__all") {
      result = result.filter((r) => r.program === program);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.applicant.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.program.toLowerCase().includes(q),
      );
    }
    result = [...result].sort((a, b) => {
      const ta = a.submittedAtIso ? new Date(a.submittedAtIso).getTime() : 0;
      const tb = b.submittedAtIso ? new Date(b.submittedAtIso).getTime() : 0;
      return sort === "newest" ? tb - ta : ta - tb;
    });
    return result;
  }, [all, tab, program, search, sort]);

  const tabCounts = useMemo(() => {
    const c = { all: all.length, pending: 0, approved: 0, rejected: 0 };
    for (const r of all) {
      if (r.statusKey === "approved") c.approved++;
      else if (r.statusKey === "rejected") c.rejected++;
      else if (r.statusKey === "pending" || r.statusKey === "submitted")
        c.pending++;
    }
    return c;
  }, [all]);

  const visible = filtered.slice(0, 10);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Recent applications</CardTitle>
          <CardDescription>
            Triage submissions and jump into review
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm" className="self-start">
          <Link href="/admissions/all">
            View all
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
        </Button>
      </CardHeader>

      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as StatusKey)}
          className="w-full lg:w-auto"
        >
          <TabsList className="w-full justify-start gap-1 lg:w-auto">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1 px-1.5 text-[10px]">
                {tabCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-1 px-1.5 text-[10px]">
                {tabCounts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              <Badge variant="secondary" className="ml-1 px-1.5 text-[10px]">
                {tabCounts.approved}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              <Badge variant="secondary" className="ml-1 px-1.5 text-[10px]">
                {tabCounts.rejected}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicants..."
              className="h-9 w-[220px] pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="size-4" strokeWidth={1.75} />
                {program === "__all" ? "Program" : program}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
              <DropdownMenuLabel>Program</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={program === "__all"}
                onCheckedChange={() => setProgram("__all")}
              >
                All programs
              </DropdownMenuCheckboxItem>
              {programs.map((p) => (
                <DropdownMenuCheckboxItem
                  key={p}
                  checked={program === p}
                  onCheckedChange={() => setProgram(p)}
                >
                  {p}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <ArrowUpDown className="size-4" strokeWidth={1.75} />
                {sort === "newest" ? "Newest" : "Oldest"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setSort("newest")}>
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSort("oldest")}>
                Oldest first
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Inbox className="size-6" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-700">
            No applications match your filters
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try clearing search or switching tabs.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100">
              <TableHead className="pl-6">Applicant</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Admission type</TableHead>
              <TableHead>Date applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r) => {
              const detailHref = r.linkId
                ? `/applications/${encodeURIComponent(r.linkId)}`
                : null;
              const pillClass =
                STATUS_PILL[r.statusKey as keyof typeof STATUS_PILL] ??
                "bg-slate-100 text-slate-700";
              return (
                <TableRow key={r.key} className="border-slate-100">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(8,151,53,0.08)] text-[12px] font-semibold text-[var(--bb-primary)]">
                        {getInitials(r.applicant)}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium text-slate-900">
                          {r.applicant}
                        </div>
                        <div className="truncate text-[11px] text-slate-500">
                          {r.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px] text-slate-700">
                    {r.program}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      Enrolled
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[13px] text-slate-500">
                    {r.submittedAt}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${pillClass}`}
                    >
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    {detailHref ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" strokeWidth={1.75} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem asChild>
                            <Link href={detailHref}>View application</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`mailto:${r.email}`}>Email applicant</a>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
