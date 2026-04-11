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
    <div className="flex h-screen overflow-hidden bg-white text-gray-900">
      <DashboardSidebar applicationCount={applicationCount} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
