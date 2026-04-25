import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchProgramsCached } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default async function ProgramsAllPage() {
  const res = await fetchProgramsCached();
  const programs = res.ok ? res.data : [];
  const err = res.ok ? null : res.error;

  return (
    <WorkspaceShell subtitle="Curriculum, duration, and requirements for every offering.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted-foreground)]">
          {err ? "Programs table uses the new schema — run backend migration if empty." : null}
        </p>
        <Button asChild>
          <Link href="/programs/add">
            <Plus className="size-4" />
            Add program
          </Link>
        </Button>
      </div>
      {err ? (
        <p className="text-sm text-amber-800">{err}</p>
      ) : programs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-slate-600">
            No programs yet. Add one to power forms and reporting.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {programs.map((p) => (
            <Link key={String(p.id)} href={`/programs/${p.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <Badge variant="outline">{(p.status as string) || "active"}</Badge>
                  </div>
                  <CardDescription>
                    {p.duration || "Duration TBD"} · {p.application_count ?? 0} applications
                    matched
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-slate-600">
                    {p.description || "No description yet."}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </WorkspaceShell>
  );
}
