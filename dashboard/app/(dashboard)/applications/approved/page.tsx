import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function ApplicationsApprovedPage() {
  return (
    <WorkspaceShell
      title="Approved applications"
      subtitle="Filtered with GET /applications?status=approved"
    >
      <ApplicationsTableBlock
        title="Approved"
        description="Applications marked approved in the database."
        statusFilter="approved"
      />
    </WorkspaceShell>
  );
}
