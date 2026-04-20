import { Users } from "lucide-react";
import {
  fetchStudentsCached,
  studentTableRows,
  type StudentTableRowView,
} from "@/lib/api";

function StudentsTableBody({ rows }: { rows: StudentTableRowView[] }) {
  return (
    <tbody>
      {rows.map((r) => (
        <tr
          key={r.key}
          className="border-t border-[var(--border)] transition-colors hover:bg-[rgba(8,151,53,0.06)] dark:hover:bg-[rgba(8,151,53,0.1)]"
        >
          <td className="px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            {r.studentId}
          </td>
          <td className="px-4 py-3 text-sm text-[var(--foreground)]">{r.name}</td>
          <td className="max-w-[12rem] truncate px-4 py-3 text-sm text-[var(--muted-foreground)]">
            {r.email}
          </td>
          <td className="max-w-[10rem] truncate px-4 py-3 text-sm text-[var(--foreground)]">
            {r.program}
          </td>
          <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
            {r.phone}
          </td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--muted-foreground)]">
            {r.joinedAt}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export async function StudentsTableBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const result = await fetchStudentsCached();
  const students = result.ok ? result.data : [];
  const rows = studentTableRows(students);
  const loadError = result.ok ? null : result.error;

  return (
    <div className="space-y-4">
      {loadError ? (
        <div
          className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
          role="alert"
        >
          <p className="font-medium">Could not load students</p>
          <p className="mt-1 text-amber-900/90 dark:text-amber-200/90">
            {loadError}
          </p>
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
          <table className="w-full min-w-[42rem] text-left">
            <thead className="bg-[var(--muted)]/80 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date admitted</th>
              </tr>
            </thead>
            {loadError ? (
              <tbody>
                <tr className="border-t border-[var(--border)]">
                  <td
                    className="px-4 py-8 text-sm text-[var(--muted-foreground)]"
                    colSpan={6}
                  >
                    Fix the configuration above, then refresh this page.
                  </td>
                </tr>
              </tbody>
            ) : rows.length === 0 ? (
              <tbody>
                <tr className="border-t border-[var(--border)]">
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex size-14 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                        <Users className="size-7" strokeWidth={1.5} />
                      </div>
                      <p className="mt-4 text-base font-medium text-[var(--foreground)]">
                        No students yet
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Approve an application to create a student profile with a
                        BB student ID.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <StudentsTableBody rows={rows} />
            )}
          </table>
        </div>
      </section>
    </div>
  );
}
