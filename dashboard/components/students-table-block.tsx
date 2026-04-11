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
          className="border-t border-black/10 hover:bg-emerald-50/40"
        >
          <td className="px-3 py-2 text-xs font-medium text-gray-900 md:px-4 md:py-3 md:text-sm">
            {r.studentId}
          </td>
          <td className="px-3 py-2 text-xs text-gray-900 md:px-4 md:py-3 md:text-sm">
            {r.name}
          </td>
          <td className="px-3 py-2 text-xs text-gray-500 md:px-4 md:py-3 md:text-sm">
            {r.email}
          </td>
          <td className="px-3 py-2 text-xs text-gray-900 md:px-4 md:py-3 md:text-sm">
            {r.program}
          </td>
          <td className="px-3 py-2 text-xs text-gray-500 md:px-4 md:py-3 md:text-sm">
            {r.phone}
          </td>
          <td className="px-3 py-2 text-xs text-gray-500 md:px-4 md:py-3 md:text-sm">
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
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-medium">Could not load students</p>
          <p className="mt-1 text-amber-900/90">{loadError}</p>
        </div>
      ) : null}

      <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm md:p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">{description}</p>
        </div>

        <div className="mt-4 overflow-x-auto overflow-y-hidden rounded-xl border border-black/10">
          <table className="w-full min-w-[42rem] text-left">
            <thead className="bg-gray-50 text-xs text-gray-700 md:text-sm">
              <tr>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">
                  Student ID
                </th>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">Name</th>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">Email</th>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">
                  Program
                </th>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">Phone</th>
                <th className="px-3 py-2 font-medium md:px-4 md:py-3">
                  Record created
                </th>
              </tr>
            </thead>
            {loadError ? (
              <tbody>
                <tr className="border-t border-black/10">
                  <td
                    className="px-3 py-3 text-xs text-gray-500 md:px-4 md:text-sm"
                    colSpan={6}
                  >
                    Fix the configuration above, then refresh this page.
                  </td>
                </tr>
              </tbody>
            ) : rows.length === 0 ? (
              <tbody>
                <tr className="border-t border-black/10">
                  <td
                    className="px-3 py-3 text-xs text-gray-500 md:px-4 md:text-sm"
                    colSpan={6}
                  >
                    No students yet. Approve an application to create a student
                    profile.
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
