import { DashboardHomeClient } from "@/components/dashboard-home-client";
import { currentUser } from "@clerk/nextjs/server";
import { fetchApplicationsCached, fetchStudentsCached } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const [appsResult, studentsResult, user] = await Promise.all([
    fetchApplicationsCached(),
    fetchStudentsCached(),
    currentUser(),
  ]);

  const applications = appsResult.ok ? appsResult.data : [];
  const students = studentsResult.ok ? studentsResult.data : [];
  const loadError = appsResult.ok ? null : appsResult.error;

  const displayName =
    user?.firstName?.trim() ||
    "Admin";

  return (
    <DashboardHomeClient
      applications={applications}
      students={students}
      loadError={loadError}
      displayName={displayName}
    />
  );
}
