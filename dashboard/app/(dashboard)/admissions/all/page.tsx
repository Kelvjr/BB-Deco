import { ApplicationsTableBlock } from "@/components/applications-table-block";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default async function AdmissionsAllPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q ?? "";

  return (
    <WorkspaceShell subtitle="Every submission from the public apply form.">
      <ApplicationsTableBlock
        title="All applications"
        description="Live data from your admissions API."
        initialSearch={typeof q === "string" ? q : ""}
      />
    </WorkspaceShell>
  );
}
