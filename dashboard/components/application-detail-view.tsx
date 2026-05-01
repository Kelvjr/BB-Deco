"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicationDecisionPanel } from "@/components/application-decision-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  formatStatusLabel,
  normalizeApplicationStatus,
  type ApplicationRow,
  type StudentRow,
} from "@/lib/api";
import { Calendar, User } from "lucide-react";

function display(value: unknown, empty = "—"): string {
  if (value == null) return empty;
  const s = String(value).trim();
  return s === "" ? empty : s;
}

function fieldTable(rows: { label: string; value: string }[]) {
  return (
    <Table>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.label} className="border-slate-100">
            <TableCell className="w-[38%] max-w-[200px] text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {r.label}
            </TableCell>
            <TableCell className="text-[13px] text-slate-900">{r.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function statusBadgeVariant(
  s: string,
): "default" | "secondary" | "destructive" | "outline" | "soft" {
  if (s === "approved") return "soft";
  if (s === "rejected") return "destructive";
  if (s === "pending" || s === "submitted") return "secondary";
  return "outline";
}

export function ApplicationDetailView({
  row,
  applicationId,
  linkedStudent,
}: {
  row: ApplicationRow;
  applicationId: string;
  linkedStudent: StudentRow | null;
}) {
  const router = useRouter();
  const [studentCreated, setStudentCreated] = useState(Boolean(linkedStudent));
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [studentMessage, setStudentMessage] = useState("");
  const statusKey = normalizeApplicationStatus(row.status);
  const statusLabel = formatStatusLabel(row.status);
  const name = display(row.full_name, "Applicant");
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  const photo =
    typeof row.identity_photo === "string" && row.identity_photo.startsWith("data:")
      ? row.identity_photo
      : null;

  async function createStudentRecord() {
    setCreatingStudent(true);
    setStudentMessage("");
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: applicationId,
          full_name: row.full_name ?? null,
          email: row.email ?? null,
          phone: row.phone ?? null,
          program_applied: row.program_applied ?? null,
          admission_type: "enrolled",
          profile_image: photo,
        }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setStudentMessage(
          data.details || data.error || `Could not create student (${res.status}).`,
        );
        return;
      }
      setStudentCreated(true);
      setStudentMessage("Student record created");
      router.refresh();
    } catch {
      setStudentMessage("Could not create student record.");
    } finally {
      setCreatingStudent(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-12 pt-6 md:px-8">
      <nav className="text-sm text-slate-500">
        <Link
          href="/admissions/all"
          className="font-medium text-[var(--bb-primary)] hover:underline"
        >
          Admissions
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-800">Application</span>
      </nav>

      <Card className="overflow-hidden border-slate-200/80 shadow-sm">
        <div className="bg-gradient-to-br from-[rgba(8,151,53,0.12)] via-white to-slate-50/80">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              <div className="relative">
                <Avatar className="size-24 border-4 border-white shadow-md ring-2 ring-[rgba(8,151,53,0.2)] sm:size-28">
                  {photo ? (
                    <AvatarImage src={photo} alt="" className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-[rgba(8,151,53,0.12)] text-xl font-semibold text-[var(--bb-primary)]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {photo ? (
                  <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-slate-200/60" />
                ) : null}
              </div>
              <div className="min-w-0 text-center sm:pb-1 sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                    {name}
                  </h1>
                  <Badge
                    variant={statusBadgeVariant(statusKey)}
                    className="shrink-0 text-[11px] font-semibold"
                  >
                    {statusLabel}
                  </Badge>
                </div>
                <p className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-600 sm:justify-start">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-slate-400" strokeWidth={1.75} />
                    Submitted {display(row.created_at)}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-xs text-slate-500">ID {applicationId}</span>
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:max-w-xs md:items-end">
              <p className="text-center text-xs text-slate-500 md:text-right">
                Review the full record, then approve or reject.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <Tabs defaultValue="record" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 gap-0">
              <TabsTrigger value="record" className="text-[13px]">
                Application record
              </TabsTrigger>
              <TabsTrigger value="history" className="text-[13px]">
                Status &amp; review
              </TabsTrigger>
            </TabsList>
            <TabsContent value="record" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal details</CardTitle>
                  <CardDescription>Identity and demographics</CardDescription>
                </CardHeader>
                <CardContent>
                  {fieldTable([
                    { label: "Full name", value: display(row.full_name) },
                    { label: "Gender", value: display(row.gender) },
                    { label: "Date of birth", value: display(row.date_of_birth) },
                  ])}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact details</CardTitle>
                  <CardDescription>How we reach the applicant</CardDescription>
                </CardHeader>
                <CardContent>
                  {fieldTable([
                    { label: "Email", value: display(row.email) },
                    { label: "Phone", value: display(row.phone) },
                    { label: "Address", value: display(row.address) },
                  ])}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Program &amp; education</CardTitle>
                  <CardDescription>Course choice and background</CardDescription>
                </CardHeader>
                <CardContent>
                  {fieldTable([
                    { label: "Program applied for", value: display(row.program_applied) },
                    { label: "Education level", value: display(row.education_level) },
                    { label: "Institution", value: display(row.institution) },
                  ])}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Guardian / emergency</CardTitle>
                  <CardDescription>Next of kin</CardDescription>
                </CardHeader>
                <CardContent>
                  {fieldTable([
                    { label: "Name", value: display(row.guardian_name) },
                    { label: "Phone", value: display(row.guardian_phone) },
                  ])}
                </CardContent>
              </Card>

              {row.notes ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                      {String(row.notes)}
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </TabsContent>
            <TabsContent value="history" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current status</CardTitle>
                  <CardDescription>Latest decision on file</CardDescription>
                </CardHeader>
                <CardContent>
                  {fieldTable([
                    { label: "Status", value: statusLabel },
                    { label: "Submitted", value: display(row.created_at) },
                  ])}
                  <p className="mt-3 text-xs text-slate-500">
                    A full status history will appear when audit logging is enabled.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-[rgba(8,151,53,0.2)] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Decision</CardTitle>
              <CardDescription>
                Approve to create a student record, or reject with a clear outcome.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationDecisionPanel
                applicationId={applicationId}
                initialStatus={statusKey}
              />
            </CardContent>
          </Card>

          {statusKey === "approved" ? (
            <Card className="border-[rgba(8,151,53,0.2)] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Student record</CardTitle>
                <CardDescription>
                  Approved applications should have a matching student profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {studentCreated ? (
                  <div className="rounded-[var(--radius-sm)] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900">
                    Student record created
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      type="button"
                      className="w-full"
                      disabled={creatingStudent}
                      onClick={createStudentRecord}
                    >
                      {creatingStudent ? "Creating student…" : "Create Student"}
                    </Button>
                    <p className="text-xs leading-relaxed text-slate-500">
                      This creates a student profile from the approved application.
                    </p>
                  </div>
                )}
                {studentMessage ? (
                  <p className="mt-3 text-xs text-slate-600">{studentMessage}</p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {photo ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Identity photo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element -- data URL */}
                  <img
                    src={photo}
                    alt="Applicant identity photo"
                    className="size-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-8 text-center">
                <User className="mb-2 size-10 text-slate-300" strokeWidth={1.25} />
                <p className="text-sm text-slate-500">No identity photo on file</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
