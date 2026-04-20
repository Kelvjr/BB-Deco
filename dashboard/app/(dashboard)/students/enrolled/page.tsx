import { StudentsTableBlock } from "@/components/students-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function StudentsEnrolledPage() {
  return (
    <WorkspaceShell subtitle="Active learners (same directory as all students for now).">
      <StudentsTableBlock
        title="Active learners"
        description="Profiles created when applications are approved. Uses GET /students."
      />
    </WorkspaceShell>
  );
}
