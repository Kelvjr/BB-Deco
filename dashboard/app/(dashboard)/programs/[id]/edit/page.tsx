import { notFound } from "next/navigation";
import { fetchProgramById } from "@/lib/api";
import { ProgramForm } from "@/components/program-form";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default async function ProgramEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetchProgramById(id);
  if (!res.ok) notFound();
  return (
    <WorkspaceShell subtitle="Update program details.">
      <ProgramForm mode="edit" initial={res.data} programId={id} />
    </WorkspaceShell>
  );
}
