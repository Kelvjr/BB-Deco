import { DashboardHomeClient } from "@/components/dashboard-home-client";
import { fetchApplicationsCached, fetchStudentsCached } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const [appsResult, studentsResult] = await Promise.all([
    fetchApplicationsCached(),
    fetchStudentsCached(),
  ]);

  const applications = appsResult.ok ? appsResult.data : [];
  const students = studentsResult.ok ? studentsResult.data : [];
  const loadError = appsResult.ok ? null : appsResult.error;

  return (
    <DashboardHomeClient
      applications={applications}
      students={students}
      loadError={loadError}
      displayName="Admin"
    />
  );
}
