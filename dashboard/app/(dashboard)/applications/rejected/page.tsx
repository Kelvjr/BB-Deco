import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function ApplicationsRejectedPage() {
  return (
    <WorkspaceShell
      title="Rejected applications"
      subtitle="Filtered with GET /applications?status=rejected"
    >
      <ApplicationsTableBlock
        title="Rejected"
        description="Applications not admitted."
        statusFilter="rejected"
      />
    </WorkspaceShell>
  );
}
