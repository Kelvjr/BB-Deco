import { StudentsTableBlock } from "@/components/students-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function StudentsEnrolledPage() {
  return (
    <WorkspaceShell subtitle="Direct applicants and the enrolled stream (non-apprenticeship).">
      <StudentsTableBlock
        title="Enrolled students"
        description="Learners on the direct enrollment track. Data from GET /students with admission type."
        admissionMode="enrolled"
      />
    </WorkspaceShell>
  );
}
