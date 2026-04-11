import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { fetchApplicationsCached } from "@/lib/api";

export default async function DashboardGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const result = await fetchApplicationsCached();
  const applicationCount = result.ok ? result.data.length : 0;

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <DashboardSidebar applicationCount={applicationCount} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
