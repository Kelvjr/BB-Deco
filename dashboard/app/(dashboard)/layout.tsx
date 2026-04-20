import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { fetchApplicationsCached } from "@/lib/api";

export default async function DashboardGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const result = await fetchApplicationsCached();
  const applicationCount = result.ok ? result.data.length : 0;

  return (
    <DashboardShell applicationCount={applicationCount}>
      {children}
    </DashboardShell>
  );
}
