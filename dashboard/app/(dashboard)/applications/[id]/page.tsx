import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationStatusActions } from "@/components/application-status-actions";
import { fetchApplicationByIdCached } from "@/lib/api";

export const dynamic = "force-dynamic";

function display(
  value: string | number | null | undefined,
  empty = "—",
): string {
  if (value == null) return empty;
  const s = String(value).trim();
  return s === "" ? empty : s;
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchApplicationByIdCached(id);

  if (!result.ok) {
    if (result.status === 404) notFound();
    return (
      <>
        <header className="flex h-14 shrink-0 items-center border-b border-black/10 bg-white px-4 md:px-6">
          <h1 className="text-base font-semibold text-gray-900">Application</h1>
        </header>
        <main className="flex-1 bg-white p-4 md:p-6">
          <p className="text-sm text-red-700">{result.error}</p>
          <p className="mt-3 text-sm">
            <Link
              href="/applications/all"
              className="font-medium text-emerald-800 underline"
            >
              Back to all applications
            </Link>
          </p>
        </main>
      </>
    );
  }

  const row = result.data;
  const applicationIdStr = String(row.id ?? id ?? "").trim();
  if (!applicationIdStr) notFound();

  const statusStr =
    typeof row.status === "string" && row.status.trim()
      ? row.status.trim().toLowerCase()
      : "pending";

  const fields: { label: string; value: string }[] = [
    { label: "Full name", value: display(row.full_name) },
    { label: "Email", value: display(row.email) },
    { label: "Phone", value: display(row.phone) },
    { label: "Address", value: display(row.address) },
    { label: "Gender", value: display(row.gender) },
    { label: "Date of birth", value: display(row.date_of_birth) },
    { label: "Program applied", value: display(row.program_applied) },
    { label: "Education level", value: display(row.education_level) },
    { label: "Guardian name", value: display(row.guardian_name) },
    { label: "Guardian phone", value: display(row.guardian_phone) },
    { label: "Notes", value: display(row.notes) },
    { label: "Submitted", value: display(row.created_at) },
  ];

  return (
    <>
      <header className="flex h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-black/10 bg-white px-4 md:px-6">
        <div>
          <p className="text-[11px] text-gray-500">
            <Link
              href="/applications/all"
              className="font-medium text-emerald-800 hover:underline"
            >
              All applications
            </Link>
            <span className="mx-1.5 text-gray-400">/</span>
            <span>#{row.id}</span>
          </p>
          <h1 className="text-base font-semibold text-gray-900 md:text-lg">
            {display(row.full_name, "Application")}
          </h1>
        </div>
      </header>

      <main className="flex-1 bg-white p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-5">
          <ApplicationStatusActions
            applicationId={applicationIdStr}
            initialStatus={statusStr}
          />

          <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Details</h2>
            <dl className="mt-3 divide-y divide-black/10">
              {fields.map(({ label, value }) => (
                <div key={label} className="grid gap-0.5 py-2.5 first:pt-0">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    {label}
                  </dt>
                  <dd className="whitespace-pre-wrap text-sm text-gray-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>
    </>
  );
}
