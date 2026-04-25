import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationDetailView } from "@/components/application-detail-view";
import {
  fetchApplicationByIdCached,
} from "@/lib/api";

export const dynamic = "force-dynamic";

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
      <div className="mx-auto max-w-2xl px-4 py-10 md:px-8">
        <p className="text-sm text-red-600">{result.error}</p>
        <p className="mt-4 text-sm">
          <Link
            href="/admissions/all"
            className="font-medium text-[var(--bb-primary)] underline"
          >
            Back to all applications
          </Link>
        </p>
      </div>
    );
  }

  const row = result.data;
  const applicationIdStr = String(row.id ?? id ?? "").trim();
  if (!applicationIdStr) notFound();

  return <ApplicationDetailView row={row} applicationId={applicationIdStr} />;
}
