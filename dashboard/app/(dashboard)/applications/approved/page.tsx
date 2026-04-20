import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function ApplicationsApprovedPage() {
  return (
    <WorkspaceShell subtitle="Applications marked approved.">
      <ApplicationsTableBlock
        title="Approved"
        description="Applications marked approved in the database."
        statusFilter="approved"
      />
    </WorkspaceShell>
  );
}
