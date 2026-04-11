import Link from "next/link";
import { WorkspaceShell } from "@/components/workspace-shell";

export default function ApplicationsPendingPage() {
  return (
    <WorkspaceShell
      title="Pending applications"
      subtitle="Awaiting review or decision."
    >
      <div className="rounded-2xl border border-dashed border-black/15 bg-gray-50/40 px-5 py-12 text-center">
        <p className="text-sm font-medium text-gray-900">
          No status field yet
        </p>
        <p className="mt-2 text-xs text-gray-500">
          When your API stores a pending status, this view will filter
          automatically. For now, see{" "}
          <Link className="text-emerald-800 underline" href="/applications/all">
            All applications
          </Link>
          .
        </p>
      </div>
    </WorkspaceShell>
  );
}
