import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function AdmissionsApprovedPage() {
  return (
    <WorkspaceShell subtitle="Applicants accepted into a program.">
      <ApplicationsTableBlock
        title="Approved applications"
        description="Each approval also creates a student record."
        statusFilter="approved"
      />
    </WorkspaceShell>
  );
}
