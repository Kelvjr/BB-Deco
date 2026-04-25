import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function AdmissionsPendingPage() {
  return (
    <WorkspaceShell subtitle="Awaiting your review.">
      <ApplicationsTableBlock
        title="Pending review"
        description="New submissions default to pending until you change status."
        statusFilter="pending"
      />
    </WorkspaceShell>
  );
}
