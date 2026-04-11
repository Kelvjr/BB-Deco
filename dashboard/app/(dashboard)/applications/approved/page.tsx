import Link from "next/link";
import { WorkspaceShell } from "@/components/workspace-shell";

export default function ApplicationsApprovedPage() {
  return (
    <WorkspaceShell
      title="Approved applications"
      subtitle="Applications marked as approved."
    >
      <div className="rounded-2xl border border-dashed border-black/15 bg-gray-50/40 px-5 py-12 text-center">
        <p className="text-sm font-medium text-gray-900">
          No status field yet
        </p>
        <p className="mt-2 text-xs text-gray-500">
          When your API stores an approval status, this view will list only
          approved records. Until then, use{" "}
          <Link className="text-emerald-800 underline" href="/applications/all">
            All applications
          </Link>
          .
        </p>
      </div>
    </WorkspaceShell>
  );
}
