import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationDecisionPanel } from "@/components/application-decision-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  fetchApplicationByIdCached,
  formatStatusLabel,
  normalizeApplicationStatus,
} from "@/lib/api";

export const dynamic = "force-dynamic";

function display(value: unknown, empty = "—"): string {
  if (value == null) return empty;
  const s = String(value).trim();
  return s === "" ? empty : s;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--card-shadow)]">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
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
      <div className="mx-auto max-w-2xl px-4 py-10 md:px-8">
        <p className="text-sm text-red-600">{result.error}</p>
        <p className="mt-4 text-sm">
          <Link
            href="/applications/all"
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

  const statusStr = normalizeApplicationStatus(row.status);
  const statusLabel = formatStatusLabel(row.status);

  const photo =
    typeof row.identity_photo === "string" && row.identity_photo.startsWith("data:")
      ? row.identity_photo
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 pt-6 md:px-8 md:pb-12 md:pt-8">
      <nav className="text-sm text-[var(--muted-foreground)]">
        <Link
          href="/applications/all"
          className="font-medium text-[var(--bb-primary)] hover:underline"
        >
          Applications
        </Link>
        <span className="mx-2 text-[var(--border)]">/</span>
        <span className="text-[var(--foreground)]">#{row.id}</span>
      </nav>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            {display(row.full_name, "Application")}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Submitted {display(row.created_at)}
          </p>
        </div>
        <StatusBadge statusKey={statusStr} label={statusLabel} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
          <Section title="Personal information">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Full name
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {display(row.full_name)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Gender
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {display(row.gender)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Date of birth
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {display(row.date_of_birth)}
                </dd>
              </div>
            </dl>
          </Section>

          <Section title="Contact">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {display(row.email)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Phone
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {display(row.phone)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Address
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-[var(--foreground)]">
                  {display(row.address)}
                </dd>
              </div>
            </dl>
          </Section>

          <Section title="Education">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Program applied for
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {display(row.program_applied)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Education level
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {display(row.education_level)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Institution
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {display(row.institution)}
                </dd>
              </div>
            </dl>
          </Section>

          <Section title="Guardian / emergency contact">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Name
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {display(row.guardian_name)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Phone
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {display(row.guardian_phone)}
                </dd>
              </div>
            </dl>
          </Section>

          {row.notes ? (
            <Section title="Notes">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
                {display(row.notes, "")}
              </p>
            </Section>
          ) : null}
        </div>

        <div className="order-1 space-y-6 lg:order-2 lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--card-shadow)]">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                Decision
              </h2>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Approve or reject this application. You can fine-tune status
                below if needed.
              </p>
              <div className="mt-5">
                <ApplicationDecisionPanel
                  applicationId={applicationIdStr}
                  initialStatus={statusStr}
                />
              </div>
            </div>

            {photo ? (
              <div className="mt-6 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--card-shadow)]">
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  Identity photo
                </h2>
                <div className="relative mt-3 aspect-square w-full max-w-xs overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--muted)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt="Applicant portrait"
                    className="size-full object-cover"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

    </div>
  );
}
