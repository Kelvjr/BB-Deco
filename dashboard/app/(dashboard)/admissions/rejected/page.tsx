import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function AdmissionsRejectedPage() {
  return (
    <WorkspaceShell subtitle="Applications that were declined.">
      <ApplicationsTableBlock
        title="Rejected applications"
        description="Records remain so decisions can be revisited."
        statusFilter="rejected"
      />
    </WorkspaceShell>
  );
}
