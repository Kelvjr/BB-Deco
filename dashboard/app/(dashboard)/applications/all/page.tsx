import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function ApplicationsAllPage() {
  return (
    <WorkspaceShell subtitle="Every submission from the public apply form.">
      <ApplicationsTableBlock
        title="Applications"
        description="Live data from your admissions API."
      />
    </WorkspaceShell>
  );
}
