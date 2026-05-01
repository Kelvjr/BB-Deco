import { StudentsTableBlock } from "@/components/students-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function AlumniStudentsPage() {
  return (
    <WorkspaceShell subtitle="Students who completed their training and moved into alumni records.">
      <StudentsTableBlock
        title="Alumni students"
        description="Completed learners are moved here when their profile is marked as completed."
        admissionMode="alumni"
      />
    </WorkspaceShell>
  );
}
