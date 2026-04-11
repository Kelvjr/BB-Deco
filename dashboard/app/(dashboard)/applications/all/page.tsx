import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default async function ApplicationsAllPage() {
  return (
    <WorkspaceShell
      title="All applications"
      subtitle="Every submission from the public apply form."
    >
      <ApplicationsTableBlock
        title="Applications"
        description="Live data from your admissions API."
      />
    </WorkspaceShell>
  );
}
