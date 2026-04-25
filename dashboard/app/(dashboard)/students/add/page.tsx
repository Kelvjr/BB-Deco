import { AddStudentForm } from "@/components/add-student-form";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function StudentsAddPage() {
  return (
    <WorkspaceShell subtitle="Manually register a learner when they did not use the public apply form.">
      <AddStudentForm />
    </WorkspaceShell>
  );
}
