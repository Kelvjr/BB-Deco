import { StudentsTableBlock } from "@/components/students-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function ApprenticeshipsPage() {
  return (
    <WorkspaceShell subtitle="Government or sponsored apprenticeship intake.">
      <StudentsTableBlock
        title="Apprenticeship students"
        description="Set admission type to “Apprenticeship” when adding a student or extend the apply form later."
        admissionMode="apprenticeship"
        emptyActionHref="/students/add?admission=apprenticeship"
        emptyActionLabel="Create Student"
      />
    </WorkspaceShell>
  );
}
