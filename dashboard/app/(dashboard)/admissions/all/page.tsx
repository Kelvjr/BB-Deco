import { ApplicationsPolishedPage } from "@/components/applications-polished-page";
import { fetchApplicationsCached } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdmissionsAllPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q ?? "";
  const result = await fetchApplicationsCached();

  return (
    <ApplicationsPolishedPage
      applications={result.ok ? result.data : []}
      error={result.ok ? undefined : result.error}
      initialSearch={typeof q === "string" ? q : ""}
    />
  );
}
