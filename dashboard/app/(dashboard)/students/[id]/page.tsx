import Link from "next/link";
import { notFound } from "next/navigation";
import { StudentProfileView } from "@/components/student-profile-view";
import { fetchStudentByIdCached } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchStudentByIdCached(id);
  if (!result.ok) {
    if (result.status === 404) notFound();
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-red-600">{result.error}</p>
        <p className="mt-4 text-sm">
          <Link href="/students/all" className="text-[var(--bb-primary)] underline">
            Back to students
          </Link>
        </p>
      </div>
    );
  }
  if (!result.data || result.data.id == null) notFound();
  return <StudentProfileView row={result.data} />;
}
