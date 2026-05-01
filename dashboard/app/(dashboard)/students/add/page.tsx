import { AddStudentForm } from "@/components/add-student-form";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default async function StudentsAddPage({
  searchParams,
}: {
  searchParams: Promise<{ admission?: string }>;
}) {
  const admission = (await searchParams).admission;
  const defaultAdmissionType =
    admission === "apprenticeship" ? "apprenticeship" : "enrolled";

  return (
    <WorkspaceShell subtitle="Manually register a learner when they did not use the public apply form.">
      <AddStudentForm defaultAdmissionType={defaultAdmissionType} />
    </WorkspaceShell>
  );
}
