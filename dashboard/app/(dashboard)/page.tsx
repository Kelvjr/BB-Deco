import { DashboardHomeClient } from "@/components/dashboard-home-client";
import { currentUser } from "@clerk/nextjs/server";
import {
  fetchApplicationsCached,
  fetchProgramBreakdownCached,
  fetchStudentsCached,
} from "@/lib/api";
import type { StudentRow } from "@/lib/api";

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
  const [appsResult, studentsResult, programBreakdownResult, user] =
    await Promise.all([
      fetchApplicationsCached(),
      fetchStudentsCached(),
      fetchProgramBreakdownCached(),
      currentUser(),
    ]);

  const applications = appsResult.ok ? appsResult.data : [];
  const students = studentsResult.ok ? studentsResult.data : [];
  const programBreakdownFromApi = programBreakdownResult.ok
    ? programBreakdownResult.data
    : [];
  const loadError = appsResult.ok ? null : appsResult.error;

  const displayName = firstNameFromFullName(user?.fullName);
  const { enrolled, apprenticeship } = streamCounts(students);

  return (
    <DashboardHomeClient
      applications={applications}
      students={students}
      programBreakdownFromApi={programBreakdownFromApi}
      streamEnrolled={enrolled}
      streamApprenticeship={apprenticeship}
      loadError={loadError}
      displayName={displayName}
    />
  );
}
