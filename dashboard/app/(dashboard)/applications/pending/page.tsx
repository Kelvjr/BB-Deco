import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function ApplicationsPendingPage() {
  return (
    <WorkspaceShell
      title="Pending applications"
      subtitle="Filtered with GET /applications?status=pending"
    >
      <ApplicationsTableBlock
        title="Pending review"
        description="New submissions default to pending until you change status."
        statusFilter="pending"
      />
    </WorkspaceShell>
  );
}
