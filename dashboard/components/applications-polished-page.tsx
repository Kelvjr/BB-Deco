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
    return "bg-emerald-100 text-emerald-700";
  }
  if (statusKey === "rejected") {
    return "bg-red-100 text-red-700";
  }
  if (statusKey === "pending" || statusKey === "submitted") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-slate-100 text-slate-600";
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
    <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-slate-400">{label}</p>
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-xl",
            iconClassName,
          )}
        >
          {icon}
        </div>
      </div>
      <div className="mt-7 text-4xl font-bold tracking-normal text-slate-950">
        {value}
      </div>
      <div
        className={cn(
          "mt-2 flex items-center gap-2 text-sm font-semibold",
          trendTone === "positive" && "text-emerald-600",
          trendTone === "negative" && "text-red-500",
          trendTone === "neutral" && "text-slate-400",
        )}
      >
        {trendTone === "positive" ? (
          <TrendingUp className="size-4" />
        ) : trendTone === "negative" ? (
          <TrendingDown className="size-4" />
        ) : (
          <span className="h-px w-4 bg-slate-400" />
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
        "relative flex h-[52px] min-w-[150px] items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm",
        className,
      )}
    >
      <span className="mr-2 shrink-0 text-slate-400">{label}:</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 appearance-none bg-transparent pr-6 font-semibold outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 size-4 text-slate-400" />
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
        "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 ring-white",
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
    <div className="min-h-full bg-[#eaf3f7] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-normal text-slate-950">
              Applications
            </h1>
            <p className="mt-3 text-lg text-slate-400">
              Manage and review incoming student applications.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12 w-fit rounded-xl border-slate-200 bg-white px-5 text-base font-semibold shadow-sm"
              >
                <Download className="size-5" />
                Export
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 rounded-2xl p-4 shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
            >
              <DropdownMenuItem className="gap-4 rounded-xl px-3 py-4 text-base font-semibold">
                <FileText className="size-5" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-4 rounded-xl px-3 py-4 text-base font-semibold">
                <Table2 className="size-5" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-4 rounded-xl px-3 py-4 text-base font-semibold">
                <FileType2 className="size-5" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="relative max-w-md">
                <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) =>
                    setFilter(() => setQuery(event.target.value))
                  }
                  placeholder="Search applicants..."
                  className="h-[52px] w-full rounded-xl border-0 bg-[#eaf3f7] pr-4 pl-12 text-base font-medium text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-4 text-sm font-bold text-slate-500">
                  <SlidersHorizontal className="size-4" />
                  Filters
                </div>
                {[
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(() => setStatus(option.value))}
                    className={cn(
                      "h-9 rounded-full px-4 text-sm font-bold transition",
                      status === option.value
                        ? "bg-slate-950 text-white"
                        : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:justify-end">
              <FilterSelect
                label="Status"
                value={status}
                options={[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
                onChange={(value) => setFilter(() => setStatus(value))}
              />
              <FilterSelect
                label="Program"
                value={program}
                options={filterOptions.programs}
                onChange={(value) => setFilter(() => setProgram(value))}
                className="min-w-[190px]"
              />
              <FilterSelect
                label="Date submitted"
                value={dateSubmitted}
                options={dateFilters}
                onChange={(value) => setFilter(() => setDateSubmitted(value))}
                className="min-w-[210px]"
              />
              <FilterSelect
                label="Intake"
                value={intake}
                options={filterOptions.intakes}
                onChange={(value) => setFilter(() => setIntake(value))}
              />
              <FilterSelect
                label="Education level"
                value={educationLevel}
                options={filterOptions.educationLevels}
                onChange={(value) => setFilter(() => setEducationLevel(value))}
                className="min-w-[220px]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Applicant Details
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Program
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Date Applied
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Intake
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Education Level
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-bold tracking-widest text-slate-400 uppercase">
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
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <ApplicantAvatar name={`${name}-${index}`} />
                            <div>
                              <div className="font-bold text-slate-950">
                                {name}
                              </div>
                              <div className="mt-1 text-sm font-medium text-slate-400">
                                {email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 font-bold text-slate-950">
                          {compact(row.program_applied) || "-"}
                        </td>
                        <td className="px-6 py-6 font-medium text-slate-400">
                          {formatDashboardDateOnly(submittedDate(row))}
                        </td>
                        <td className="px-6 py-6 font-medium text-slate-500">
                          {intakeValue(row) || "-"}
                        </td>
                        <td className="px-6 py-6 font-medium text-slate-500">
                          {compact(row.education_level) || "-"}
                        </td>
                        <td className="px-6 py-6">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-4 py-2 text-sm font-bold",
                              statusBadgeClass(statusKey),
                            )}
                          >
                            {formatStatusLabel(row.status)}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-slate-400"
                                aria-label={`Actions for ${name}`}
                              >
                                <MoreVertical className="size-5" />
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
                        className="border-b border-slate-100 transition hover:bg-slate-50/70"
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
                      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <GraduationCap className="size-7" />
                      </div>
                      <h2 className="mt-5 text-xl font-bold text-slate-950">
                        No applications found
                      </h2>
                      <p className="mt-2 text-sm font-medium text-slate-400">
                        Adjust the filters or wait for new applications from the
                        public apply form.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-950">{showingFrom}</span> to{" "}
              <span className="font-bold text-slate-950">{showingTo}</span> of{" "}
              <span className="font-bold text-slate-950">
                {filtered.length}
              </span>{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl"
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
                      "size-11 rounded-xl text-sm font-bold transition",
                      safePage === number
                        ? "bg-[#eaf3f7] text-slate-950"
                        : "text-slate-400 hover:bg-slate-50",
                    )}
                  >
                    {number}
                  </button>
                );
              })}
              {pageCount > 4 ? (
                <>
                  <span className="px-2 font-bold text-slate-400">...</span>
                  <button
                    type="button"
                    onClick={() => setPage(pageCount)}
                    className={cn(
                      "size-11 rounded-xl text-sm font-bold transition",
                      safePage === pageCount
                        ? "bg-[#eaf3f7] text-slate-950"
                        : "text-slate-400 hover:bg-slate-50",
                    )}
                  >
                    {pageCount}
                  </button>
                </>
              ) : null}
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl"
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
    </div>
  );
}
