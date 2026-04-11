import { StudentsTableBlock } from "@/components/students-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function StudentsEnrolledPage() {
  return (
    <WorkspaceShell
      title="Enrolled students"
      subtitle="Same directory as “All students” for now; later we can split by enrollment status."
    >
      <StudentsTableBlock
        title="Active learners"
        description="Profiles created when applications are approved. Uses GET /students."
      />
    </WorkspaceShell>
  );
}
