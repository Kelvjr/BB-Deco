import { DashboardHomeClient } from "@/components/dashboard-home-client";
import { currentUser } from "@clerk/nextjs/server";
import {
  fetchApplicationsCached,
  fetchProgramBreakdownCached,
  fetchProgramsCached,
  fetchStudentsCached,
} from "@/lib/api";
import type { ProgramRow, StudentRow } from "@/lib/api";

export const dynamic = "force-dynamic";

function firstNameFromFullName(fullName?: string | null): string {
  const cleaned = fullName?.trim();
  if (!cleaned) return "Admin";
  return cleaned.split(/\s+/)[0] || "Admin";
}

function streamCounts(students: StudentRow[]) {
  let enrolled = 0;
  let apprenticeship = 0;
  for (const s of students) {
    const t = (s.admission_type ?? "enrolled").toLowerCase();
    if (t === "apprenticeship") apprenticeship++;
    else enrolled++;
  }
  return { enrolled, apprenticeship };
}

export default async function DashboardHomePage() {
  const [appsResult, studentsResult, programBreakdownResult, programsResult, user] =
    await Promise.all([
      fetchApplicationsCached(),
      fetchStudentsCached(),
      fetchProgramBreakdownCached(),
      fetchProgramsCached(),
      currentUser(),
    ]);

  const applications = appsResult.ok ? appsResult.data : [];
  const students = studentsResult.ok ? studentsResult.data : [];
  const programBreakdownFromApi = programBreakdownResult.ok
    ? programBreakdownResult.data
    : [];
  const programsCatalog: ProgramRow[] = programsResult.ok
    ? programsResult.data
    : [];
  const loadError = appsResult.ok ? null : appsResult.error;

  const displayName = firstNameFromFullName(user?.fullName);
  const { enrolled, apprenticeship } = streamCounts(students);

  return (
    <DashboardHomeClient
      applications={applications}
      students={students}
      programBreakdownFromApi={programBreakdownFromApi}
      programsCatalog={programsCatalog}
      streamEnrolled={enrolled}
      streamApprenticeship={apprenticeship}
      loadError={loadError}
      displayName={displayName}
    />
  );
}
