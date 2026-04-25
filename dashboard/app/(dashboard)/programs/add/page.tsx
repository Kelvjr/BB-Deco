import { ProgramForm } from "@/components/program-form";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function ProgramsAddPage() {
  return (
    <WorkspaceShell subtitle="Create a program record used for analytics and the apply form.">
      <ProgramForm mode="create" />
    </WorkspaceShell>
  );
}
