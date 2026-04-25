import type { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/dashboard-shell";
import { fetchApplicationsCached } from "@/lib/api";

export default async function DashboardGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [result, user] = await Promise.all([fetchApplicationsCached(), currentUser()]);
  const applicationCount = result.ok ? result.data.length : 0;
  const administratorName =
    user?.fullName?.trim() || user?.firstName?.trim() || "Administrator";

  return (
    <DashboardShell
      applicationCount={applicationCount}
      administratorName={administratorName}
    >
      {children}
    </DashboardShell>
  );
}
