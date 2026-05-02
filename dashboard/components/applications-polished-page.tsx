"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  FileType2,
  GraduationCap,
  MoreVertical,
  Search,
  SlidersHorizontal,
  Table2,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  applicationLinkId,
  formatStatusLabel,
  normalizeApplicationStatus,
  type ApplicationRow,
} from "@/lib/api";
import { formatDashboardDateOnly } from "@/lib/date-format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ApplicationsPolishedPageProps = {
  applications: ApplicationRow[];
  error?: string;
  initialSearch?: string;
};

type ApplicationCounts = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

const PAGE_SIZE = 5;

const dateFilters = [
  { value: "all", label: "All dates" },
  { value: "today", label: "Today" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

function compact(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function uniqueOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

function submittedDate(row: ApplicationRow): string {
  return (
    compact(row.created_at) ||
    compact(row.submitted_at) ||
    compact(row.inserted_at)
  );
}

function intakeValue(row: ApplicationRow): string {
  return (
    compact(row.intake) ||
    compact(row.intake_period) ||
    compact(row.intake_name) ||
    compact(row.cohort) ||
    compact(row.cohort_name)
  );
}

function applicantInitials(name: string) {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return "BD";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function matchesDateFilter(rawDate: string, filter: string) {
  if (filter === "all") return true;
  if (!rawDate) return false;
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  if (filter === "today") {
    return date.toDateString() === now.toDateString();
  }

  const days = Number(filter);
  if (!Number.isFinite(days)) return true;
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - days);
  return date >= cutoff;
}

function statusBadgeClass(statusKey: string) {
  if (statusKey === "approved") {
    return "bg-[rgba(8,151,53,0.10)] text-[var(--bb-primary)]";
  }
  if (statusKey === "rejected") {
    return "bg-rose-50 text-rose-700";
  }
  if (statusKey === "pending" || statusKey === "submitted") {
    return "bg-amber-50 text-amber-700";
  }
  return "bg-[var(--muted)] text-[var(--muted-foreground)]";
}

function MetricCard({
  label,
  value,
  icon,
  iconClassName,
  trend,
  trendTone = "neutral",
}: {
  label: string;
  value: number;
  icon: ReactNode;
  iconClassName: string;
  trend: string;
  trendTone?: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)] transition-all hover:-translate-y-0.5 hover:shadow-md xl:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            iconClassName,
          )}
        >
          {icon}
        </div>
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
      <div
        className={cn(
          "mt-2 flex items-center gap-1.5 text-[11px]",
          trendTone === "positive" && "text-emerald-700",
          trendTone === "negative" && "text-rose-700",
          trendTone === "neutral" && "text-slate-500",
        )}
      >
        {trendTone === "positive" ? (
          <TrendingUp className="size-4" />
        ) : trendTone === "negative" ? (
          <TrendingDown className="size-4" />
        ) : (
          <span className="h-px w-4 bg-slate-300" />
        )}
        {trend}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "relative flex h-9 min-w-0 items-center rounded-md border border-[var(--border)] bg-white px-3 text-[12px] font-medium text-slate-800 shadow-xs",
        className,
      )}
    >
      <span className="mr-1.5 shrink-0 text-slate-500">{label}:</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 appearance-none bg-transparent pr-5 font-medium outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-3.5 text-slate-400" />
    </label>
  );
}

function ApplicantAvatar({ name }: { name: string }) {
  const colors = [
    "bg-emerald-100 text-emerald-700",
    "bg-sky-100 text-sky-700",
    "bg-amber-100 text-amber-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
  ];
  const index = name.length % colors.length;
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ring-2 ring-white",
        colors[index],
      )}
    >
      {applicantInitials(name)}
    </div>
  );
}

export function ApplicationsPolishedPage({
  applications,
  error,
  initialSearch = "",
}: ApplicationsPolishedPageProps) {
  const [query, setQuery] = useState(initialSearch);
  const [status, setStatus] = useState("all");
  const [program, setProgram] = useState("all");
  const [dateSubmitted, setDateSubmitted] = useState("all");
  const [intake, setIntake] = useState("all");
  const [educationLevel, setEducationLevel] = useState("all");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    return applications.reduce<ApplicationCounts>(
      (acc, row) => {
        const key = normalizeApplicationStatus(row.status);
        if (key === "approved") acc.approved += 1;
        else if (key === "rejected") acc.rejected += 1;
        else acc.pending += 1;
        return acc;
      },
      { total: applications.length, pending: 0, approved: 0, rejected: 0 },
    );
  }, [applications]);

  const filterOptions = useMemo(() => {
    const programs = uniqueOptions(
      applications.map((row) => compact(row.program_applied)),
    );
    const intakes = uniqueOptions(applications.map((row) => intakeValue(row)));
    const educationLevels = uniqueOptions(
      applications.map((row) => compact(row.education_level)),
    );
    return {
      programs: [
        { value: "all", label: "All Programs" },
        ...programs.map((value) => ({ value, label: value })),
      ],
      intakes: [
        { value: "all", label: "All intake" },
        ...intakes.map((value) => ({ value, label: value })),
      ],
      educationLevels: [
        { value: "all", label: "All levels" },
        ...educationLevels.map((value) => ({ value, label: value })),
      ],
    };
  }, [applications]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((row) => {
      const rowStatus = normalizeApplicationStatus(row.status);
      const rowProgram = compact(row.program_applied);
      const rowIntake = intakeValue(row);
      const rowEducation = compact(row.education_level);
      const rowDate = submittedDate(row);
      const searchable = [
        row.full_name,
        row.email,
        row.phone,
        row.program_applied,
        row.education_level,
        rowIntake,
      ]
        .map((value) => compact(value).toLowerCase())
        .join(" ");

      return (
        (!q || searchable.includes(q)) &&
        (status === "all" || rowStatus === status) &&
        (program === "all" || rowProgram === program) &&
        (intake === "all" || rowIntake === intake) &&
        (educationLevel === "all" || rowEducation === educationLevel) &&
        matchesDateFilter(rowDate, dateSubmitted)
      );
    });
  }, [applications, dateSubmitted, educationLevel, intake, program, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const showingFrom = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(safePage * PAGE_SIZE, filtered.length);

  function setFilter(next: () => void) {
    next();
    setPage(1);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Applications
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Manage and review incoming student applications.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-fit text-[13px] font-semibold"
              >
                <Download className="size-4" />
                Export
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52"
            >
              <DropdownMenuItem>
                <FileText className="size-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Table2 className="size-4" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileType2 className="size-4" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      {error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">Heads up:</span> {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-4">
          <MetricCard
            label="Total Applications"
            value={counts.total}
            icon={<Users className="size-5 text-blue-600" />}
            iconClassName="bg-blue-50"
            trend="+12% this month"
            trendTone="positive"
          />
          <MetricCard
            label="Pending Review"
            value={counts.pending}
            icon={<Clock3 className="size-5 text-orange-500" />}
            iconClassName="bg-amber-100"
            trend="No change"
          />
          <MetricCard
            label="Approved"
            value={counts.approved}
            icon={<CheckCircle2 className="size-5 text-emerald-600" />}
            iconClassName="bg-emerald-100"
            trend="+4% this month"
            trendTone="positive"
          />
          <MetricCard
            label="Rejected"
            value={counts.rejected}
            icon={<TrendingDown className="size-5 text-red-500" />}
            iconClassName="bg-red-50"
            trend="-2% this month"
            trendTone="negative"
          />
        </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--card-shadow)]">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full max-w-[360px]">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) =>
                    setFilter(() => setQuery(event.target.value))
                  }
                  placeholder="Search applicants..."
                  className="h-9 w-full rounded-md border border-[var(--border)] bg-white pr-3 pl-8 text-sm text-[var(--foreground)] shadow-xs outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--bb-primary)] focus:ring-2 focus:ring-[rgba(8,151,53,0.18)]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-9 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)]/50 px-3 text-[12px] font-medium text-slate-600">
                  <SlidersHorizontal className="size-4" />
                  Filters
                </div>
                {[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(() => setStatus(option.value))}
                    className={cn(
                      "h-9 rounded-md px-3 text-[12px] font-medium transition-colors",
                      status === option.value
                        ? "bg-[var(--bb-primary)] text-white shadow-sm"
                        : "bg-white text-slate-600 ring-1 ring-[var(--border)] hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              <FilterSelect
                label="Program"
                value={program}
                options={filterOptions.programs}
                onChange={(value) => setFilter(() => setProgram(value))}
                className="min-w-0"
              />
              <FilterSelect
                label="Date submitted"
                value={dateSubmitted}
                options={dateFilters}
                onChange={(value) => setFilter(() => setDateSubmitted(value))}
                className="min-w-0"
              />
              <FilterSelect
                label="Intake"
                value={intake}
                options={filterOptions.intakes}
                onChange={(value) => setFilter(() => setIntake(value))}
                className="min-w-0"
              />
              <FilterSelect
                label="Education level"
                value={educationLevel}
                options={filterOptions.educationLevels}
                onChange={(value) => setFilter(() => setEducationLevel(value))}
                className="min-w-0"
              />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[var(--muted)]/60">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
                    Applicant Details
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
                    Program
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
                    Date Applied
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
                    Intake
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
                    Education Level
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length > 0 ? (
                  pageRows.map((row, index) => {
                    const id = applicationLinkId(row);
                    const name = compact(row.full_name) || "Unnamed applicant";
                    const email = compact(row.email) || "No email provided";
                    const statusKey = normalizeApplicationStatus(row.status);
                    const href = id ? `/applications/${id}` : undefined;
                    const rowContent = (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <ApplicantAvatar name={name} />
                            <div className="min-w-0">
                              <div className="truncate text-[13px] font-medium text-slate-900">
                                {name}
                              </div>
                              <div className="mt-0.5 truncate text-[11px] text-slate-500">
                                {email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-[190px] truncate px-4 py-4 text-[13px] text-slate-700">
                          {compact(row.program_applied) || "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-[13px] text-slate-500">
                          {formatDashboardDateOnly(submittedDate(row))}
                        </td>
                        <td className="max-w-[130px] truncate px-4 py-4 text-[13px] text-slate-600">
                          {intakeValue(row) || "-"}
                        </td>
                        <td className="max-w-[150px] truncate px-4 py-4 text-[13px] text-slate-600">
                          {compact(row.education_level) || "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                              statusBadgeClass(statusKey),
                            )}
                          >
                            {formatStatusLabel(row.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-md text-slate-500 hover:bg-slate-100"
                                aria-label={`Actions for ${name}`}
                              >
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {href ? (
                                <DropdownMenuItem asChild>
                                  <Link href={href}>View application</Link>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem disabled>
                                  View application
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem asChild>
                                <a href={`mailto:${email}`}>Email applicant</a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </>
                    );

                    return href ? (
                      <tr
                        key={id}
                        className="border-b border-slate-100 transition hover:bg-[rgba(8,151,53,0.04)]"
                      >
                        {rowContent}
                      </tr>
                    ) : (
                      <tr
                        key={`${email}-${index}`}
                        className="border-b border-slate-100"
                      >
                        {rowContent}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <GraduationCap className="size-7" />
                      </div>
                      <h2 className="mt-4 text-sm font-medium text-slate-700">
                        No applications found
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Adjust the filters or wait for new applications from the
                        public apply form.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">{showingFrom}</span> to{" "}
              <span className="font-semibold text-slate-900">{showingTo}</span> of{" "}
              <span className="font-semibold text-slate-900">
                {filtered.length}
              </span>{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-md"
                disabled={safePage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-5" />
              </Button>
              {Array.from({ length: Math.min(3, pageCount) }, (_, index) => {
                const number = index + 1;
                return (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    className={cn(
                      "size-9 rounded-md text-sm font-medium transition-colors",
                      safePage === number
                        ? "bg-[var(--bb-primary)] text-white"
                        : "text-slate-500 hover:bg-slate-100",
                    )}
                  >
                    {number}
                  </button>
                );
              })}
              {pageCount > 4 ? (
                <>
                  <span className="px-2 text-sm font-medium text-slate-400">...</span>
                  <button
                    type="button"
                    onClick={() => setPage(pageCount)}
                    className={cn(
                      "size-9 rounded-md text-sm font-medium transition-colors",
                      safePage === pageCount
                        ? "bg-[var(--bb-primary)] text-white"
                        : "text-slate-500 hover:bg-slate-100",
                    )}
                  >
                    {pageCount}
                  </button>
                </>
              ) : null}
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-md"
                disabled={safePage === pageCount}
                onClick={() =>
                  setPage((value) => Math.min(pageCount, value + 1))
                }
                aria-label="Next page"
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}
