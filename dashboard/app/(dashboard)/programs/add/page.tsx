import { ProgramForm } from "@/components/program-form";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default async function ProgramsAddPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const q = await searchParams;
  const prefill = typeof q.name === "string" && q.name.trim() ? q.name.trim() : undefined;
  return (
    <WorkspaceShell subtitle="Create a program record used for analytics and the apply form.">
      <ProgramForm mode="create" initial={prefill ? { name: prefill } : undefined} />
    </WorkspaceShell>
  );
}
