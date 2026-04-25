"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
import type { StudentRow } from "@/lib/api";
import { BookOpen, GraduationCap, Mail, Phone, User } from "lucide-react";

function display(value: unknown, empty = "—"): string {
  if (value == null) return empty;
  const s = String(value).trim();
  return s === "" ? empty : s;
}

function admissionLabel(row: StudentRow): string {
  const t = (row.admission_type ?? "enrolled").toLowerCase();
  return t === "apprenticeship" ? "Apprenticeship" : "Enrolled";
}

function statusBadge(s: string) {
  const v = s.toLowerCase();
  if (v === "active") return "soft" as const;
  if (v === "graduated") return "secondary" as const;
  return "outline" as const;
}

export function StudentProfileView({ row }: { row: StudentRow }) {
  const name = display(row.full_name, "Student");
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
  const photo =
    typeof row.profile_image === "string" && row.profile_image.startsWith("data:")
      ? row.profile_image
      : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-12 pt-6 md:px-8">
      <nav className="text-sm text-slate-500">
        <Link
          href="/students/all"
          className="font-medium text-[var(--bb-primary)] hover:underline"
        >
          Students
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-800">Profile</span>
      </nav>

      <Card className="overflow-hidden border-slate-200/80 shadow-sm">
        <div className="bg-gradient-to-br from-[rgba(8,151,53,0.1)] via-white to-slate-50/80 p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <Avatar className="size-24 border-4 border-white shadow ring-2 ring-[rgba(8,151,53,0.2)] sm:size-28">
              {photo ? <AvatarImage src={photo} className="object-cover" alt="" /> : null}
              <AvatarFallback className="bg-[rgba(8,151,53,0.1)] text-xl font-semibold text-[var(--bb-primary)]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                {name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {display(row.student_number)}
                </Badge>
                <Badge variant={statusBadge(display(row.status, "active"))}>
                  {display(row.status, "active")}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <GraduationCap className="size-3" />
                  {admissionLabel(row)}
                </Badge>
                <Badge variant="soft" className="gap-1">
                  <BookOpen className="size-3" />
                  {display(row.program_applied, "—")}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic record</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
              <CardDescription>Reach this student or guardian</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-40 text-xs font-semibold uppercase text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        Email
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{display(row.email)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-semibold uppercase text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="size-3.5" />
                        Phone
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{display(row.phone)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-40 text-xs font-semibold uppercase text-slate-500">
                      Admitted
                    </TableCell>
                    <TableCell className="text-sm">
                      {display(row.created_at)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-semibold uppercase text-slate-500">
                      Application
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.application_id ? (
                        <Link
                          href={`/applications/${encodeURIComponent(String(row.application_id))}`}
                          className="font-medium text-[var(--bb-primary)] hover:underline"
                        >
                          View application
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="academic" className="mt-6">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <BookOpen className="mb-2 size-10 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Academic record</p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Grades, attendance, and transcripts will be linked here in a later release.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents" className="mt-6">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <User className="mb-2 size-10 text-slate-300" />
              <p className="text-sm text-slate-600">No documents uploaded yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Internal notes</CardTitle>
            </CardHeader>
            <CardContent>
              {row.notes ? (
                <p className="whitespace-pre-wrap text-sm text-slate-700">
                  {String(row.notes)}
                </p>
              ) : (
                <p className="text-sm text-slate-500">No notes yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
