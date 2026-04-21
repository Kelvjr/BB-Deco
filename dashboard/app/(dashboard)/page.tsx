import { DashboardHomeClient } from "@/components/dashboard-home-client";
import { currentUser } from "@clerk/nextjs/server";
import { fetchApplicationsCached, fetchStudentsCached } from "@/lib/api";

export const dynamic = "force-dynamic";

function firstNameFromFullName(fullName?: string | null): string {
  const cleaned = fullName?.trim();
  if (!cleaned) return "Admin";
  return cleaned.split(/\s+/)[0] || "Admin";
}

export default async function DashboardHomePage() {
  const [appsResult, studentsResult, user] = await Promise.all([
    fetchApplicationsCached(),
    fetchStudentsCached(),
    currentUser(),
  ]);

  const applications = appsResult.ok ? appsResult.data : [];
  const students = studentsResult.ok ? studentsResult.data : [];
  const loadError = appsResult.ok ? null : appsResult.error;

  const displayName = firstNameFromFullName(user?.fullName);

  return (
    <DashboardHomeClient
      applications={applications}
      students={students}
      loadError={loadError}
      displayName={displayName}
    />
  );
}
