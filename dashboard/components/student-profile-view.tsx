"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  Mail,
  MessageSquareText,
  ShieldCheck,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ApplicationRow, StudentRow } from "@/lib/api";
import { formatDashboardDate, formatDashboardDateOnly } from "@/lib/date-format";
import { cn } from "@/lib/utils";

function display(value: unknown, empty = "-"): string {
  if (value == null) return empty;
  const s = String(value).trim();
  return s === "" ? empty : s;
}

function admissionLabel(row: StudentRow): string {
  const t = (row.admission_type ?? "enrolled").toLowerCase();
  return t === "apprenticeship" ? "Apprenticeship" : "Enrolled";
}

function normalizedStatus(row: StudentRow): string {
  const s = (row.status ?? "active").trim().toLowerCase();
  if (s === "graduated") return "completed";
  return s || "active";
}

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" | "soft" {
  if (status === "active") return "soft";
  if (status === "completed") return "secondary";
  if (status === "withdrawn") return "destructive";
  return "outline";
}

function addMonths(raw: string | null | undefined, months: number): string {
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "-";
  date.setMonth(date.getMonth() + months);
  return formatDashboardDateOnly(date.toISOString());
}

function InfoCard({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: typeof User;
  rows: { label: string; value: string | React.ReactNode }[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="size-4 text-[var(--bb-primary)]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {row.label}
            </span>
            <span className="max-w-[65%] text-right text-sm font-medium text-slate-900">
              {row.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function StudentProfileView({
  row,
  application,
}: {
  row: StudentRow;
  application?: ApplicationRow | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(normalizedStatus(row));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const name = display(row.full_name, "Student");
  const initials =
    name
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const photo =
    typeof row.profile_image === "string" && row.profile_image.startsWith("data:")
      ? row.profile_image
      : null;

  const admittedAt = formatDashboardDate(row.created_at);
  const expectedCompletion = row.expected_completion_date
    ? formatDashboardDateOnly(row.expected_completion_date)
    : addMonths(row.created_at, 12);
  const progress = status === "completed" ? 100 : status === "withdrawn" ? 0 : 42;

  const studentDbId = row.id != null ? String(row.id) : "";

  async function markCompleted() {
    if (!studentDbId) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(studentDbId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setMessage(data.error || data.details || `Could not update student (${res.status}).`);
        return;
      }
      setStatus("completed");
      setMessage("Student marked as completed and moved to Alumni Students.");
      router.refresh();
    } catch {
      setMessage("Could not update student.");
    } finally {
      setSaving(false);
    }
  }

  const applicationLink = row.application_id ? (
    <Link
      href={`/applications/${encodeURIComponent(String(row.application_id))}`}
      className="text-[var(--bb-primary)] hover:underline"
    >
      View application
    </Link>
  ) : (
    "-"
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-8">
      <nav className="text-sm text-slate-500">
        <Link href="/students/all" className="font-medium text-[var(--bb-primary)] hover:underline">
          Students
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-800">Student profile</span>
      </nav>

      <Card className="overflow-hidden border-slate-200/80 shadow-sm">
        <div className="bg-gradient-to-br from-[rgba(8,151,53,0.12)] via-white to-slate-50 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <Avatar className="size-24 border-4 border-white shadow ring-2 ring-[rgba(8,151,53,0.2)] sm:size-28">
                {photo ? <AvatarImage src={photo} className="object-cover" alt="" /> : null}
                <AvatarFallback className="bg-[rgba(8,151,53,0.1)] text-xl font-semibold text-[var(--bb-primary)]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                    {name}
                  </h1>
                  <Badge variant={statusVariant(status)}>{status}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {display(row.student_number)}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <GraduationCap className="size-3" />
                    {admissionLabel(row)}
                  </Badge>
                  <Badge variant="soft" className="gap-1">
                    <BookOpen className="size-3" />
                    {display(row.program_applied)}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4 text-slate-400" />
                    Admitted {admittedAt}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Award className="size-4 text-slate-400" />
                    Expected completion {expectedCompletion}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
              {status === "completed" ? (
                <Button asChild variant="outline">
                  <Link href="/students/alumni">View in Alumni Students</Link>
                </Button>
              ) : (
                <Button onClick={markCompleted} disabled={saving || !studentDbId}>
                  <CheckCircle2 className="size-4" />
                  {saving ? "Updating..." : "Mark as Completed"}
                </Button>
              )}
              {message ? <p className="text-xs text-slate-600">{message}</p> : null}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic Record</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 grid gap-4 lg:grid-cols-2">
          <InfoCard
            title="Personal details"
            icon={User}
            rows={[
              { label: "Full name", value: name },
              { label: "Student ID", value: display(row.student_number) },
              {
                label: "Date of birth",
                value: formatDashboardDateOnly(application?.date_of_birth),
              },
              { label: "Gender", value: display(application?.gender) },
              { label: "Status", value: status },
            ]}
          />
          <InfoCard
            title="Contact details"
            icon={Mail}
            rows={[
              { label: "Email", value: display(row.email) },
              { label: "Phone", value: display(row.phone) },
              { label: "Guardian", value: display(application?.guardian_name) },
              { label: "Guardian phone", value: display(application?.guardian_phone) },
            ]}
          />
          <InfoCard
            title="Enrollment info"
            icon={ShieldCheck}
            rows={[
              { label: "Program", value: display(row.program_applied) },
              { label: "Enrollment", value: admissionLabel(row) },
              { label: "Admission date", value: admittedAt },
              { label: "Expected completion", value: expectedCompletion },
              { label: "Application", value: applicationLink },
            ]}
          />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="size-4 text-[var(--bb-primary)]" />
                Completion progress
              </CardTitle>
              <CardDescription>Academic completion and student lifecycle state.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">Overall progress</span>
                <span className="font-semibold text-slate-900">{progress}%</span>
              </div>
              <Progress value={progress} className="mt-3" />
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Use the academic record tab to connect modules, attendance, and performance
                tracking as the program data matures.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            ["Enrolled modules", "Core modules, lessons, and practical sessions will appear here."],
            ["Performance", "Assessment scores, practical grades, and instructor feedback."],
            ["Attendance summary", "Attendance percentage, absences, and make-up sessions."],
          ].map(([title, body]) => (
            <Card key={title} className={cn(title === "Enrolled modules" && "lg:col-span-1")}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-600">{body}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="mt-6 grid gap-4 md:grid-cols-3">
          {["Application documents", "Uploaded files", "Certificates"].map((title) => (
            <Card key={title} className="border-dashed">
              <CardContent className="flex flex-col items-center py-10 text-center">
                <FileText className="mb-3 size-9 text-slate-300" />
                <p className="text-sm font-medium text-slate-700">{title}</p>
                <p className="mt-1 text-xs text-slate-500">No records uploaded yet.</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="notes" className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            ["Internal admin notes", row.notes ? String(row.notes) : "No internal notes yet."],
            ["Student remarks", "Student remarks will be recorded here."],
            ["Instructor comments", "Instructor comments and disciplinary notes will appear here."],
          ].map(([title, body]) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquareText className="size-4 text-[var(--bb-primary)]" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                  {body}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
