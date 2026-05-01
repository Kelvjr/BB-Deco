import Link from "next/link";
import { Users } from "lucide-react";
import { StudentsTableBody } from "@/components/students-table-body";
import { Button } from "@/components/ui/button";
import {
  fetchStudentsCached,
  studentTableRows,
  type StudentRow,
} from "@/lib/api";

function filterByAdmission(
  students: StudentRow[],
  mode: "all" | "enrolled" | "apprenticeship" | "alumni",
): StudentRow[] {
  if (mode === "all") return students;
  if (mode === "alumni") {
    return students.filter((s) => {
      const status = (s.status ?? "active").toLowerCase();
      return status === "completed" || status === "graduated";
    });
  }
  return students.filter((s) => {
    const t = (s.admission_type ?? "enrolled").toLowerCase();
    if (mode === "apprenticeship") return t === "apprenticeship";
    return t !== "apprenticeship";
  });
}

export async function StudentsTableBlock({
  title,
  description,
  admissionMode = "all",
  emptyActionHref,
  emptyActionLabel,
}: {
  title: string;
  description: string;
  /** Subset: enrolled = non-apprenticeship stream, apprenticeship = government stream. */
  admissionMode?: "all" | "enrolled" | "apprenticeship" | "alumni";
  emptyActionHref?: string;
  emptyActionLabel?: string;
}) {
  const result = await fetchStudentsCached();
  const allStudents = result.ok ? result.data : [];
  const students = filterByAdmission(allStudents, admissionMode);
  const rows = studentTableRows(students);
  const loadError = result.ok ? null : result.error;

  return (
    <div className="space-y-4">
      {loadError ? (
        <div
          className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-medium">Could not load students</p>
          <p className="mt-1 text-amber-900/90">{loadError}</p>
        </div>
      ) : null}

      <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--card-shadow)]">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {description}
          </p>
        </div>

        <div className="mt-5 overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--border)]">
          <table className="w-full min-w-[56rem] text-left">
            <thead className="bg-[var(--muted)]/80 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Admission</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date admitted</th>
              </tr>
            </thead>
            {loadError ? (
              <tbody>
                <tr className="border-t border-[var(--border)]">
                  <td
                    className="px-4 py-8 text-sm text-[var(--muted-foreground)]"
                    colSpan={8}
                  >
                    Fix the configuration above, then refresh this page.
                  </td>
                </tr>
              </tbody>
            ) : rows.length === 0 ? (
              <tbody>
                <tr className="border-t border-[var(--border)]">
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex size-14 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                        <Users className="size-7" strokeWidth={1.5} />
                      </div>
                      <p className="mt-4 text-base font-medium text-[var(--foreground)]">
                        No students in this list
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Approve an application or add a student manually to see records here.
                      </p>
                      {emptyActionHref && emptyActionLabel ? (
                        <Button asChild className="mt-5 w-full sm:w-auto">
                          <Link href={emptyActionHref}>{emptyActionLabel}</Link>
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <StudentsTableBody rows={rows} />
            )}
          </table>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--muted-foreground)]">
          Click a row to open the student profile.
        </p>
      </section>
    </div>
  );
}
