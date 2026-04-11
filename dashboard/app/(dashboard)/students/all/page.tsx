import { StudentsTableBlock } from "@/components/students-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function StudentsAllPage() {
  return (
    <WorkspaceShell
      title="All students"
      subtitle="Everyone with a student record (created when an application is approved)."
    >
      <StudentsTableBlock
        title="Student directory"
        description="Live from GET /students on your Railway API."
      />
    </WorkspaceShell>
  );
}
