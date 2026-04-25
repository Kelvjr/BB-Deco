import Link from "next/link";
import { Plus } from "lucide-react";
import {
  fetchProgramBreakdownCached,
  fetchProgramsCached,
} from "@/lib/api";
import { buildProgramsList } from "@/lib/programs-list";
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
  const [programsRes, breakdownRes] = await Promise.all([
    fetchProgramsCached(),
    fetchProgramBreakdownCached(),
  ]);
  const programs = programsRes.ok ? programsRes.data : [];
  const breakdown = breakdownRes.ok ? breakdownRes.data : [];
  const err = !programsRes.ok ? programsRes.error : null;
  const list = buildProgramsList(programs, breakdown);

  return (
    <WorkspaceShell subtitle="Curriculum, duration, and requirements for every offering. These names match the public apply form.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted-foreground)]">
          {err
            ? "Could not load programs from the API — catalog names still show; add records when the API is available."
            : null}
        </p>
        <Button asChild>
          <Link href="/programs/add">
            <Plus className="size-4" />
            Add program
          </Link>
        </Button>
      </div>
      {err ? <p className="mb-3 text-sm text-amber-800">{err}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((p) => {
          const href = p.inDatabase && p.id
            ? `/programs/${p.id}`
            : `/programs/add?name=${encodeURIComponent(p.name)}`;
          return (
            <Link key={p.inDatabase && p.id ? p.id : `catalog-${p.name}`} href={href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1">
                      {!p.inDatabase ? (
                        <Badge variant="secondary">Set up in database</Badge>
                      ) : null}
                      <Badge variant="outline">{p.status || "active"}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {p.duration || "Duration TBD"} · {p.applicationCount} applications matched
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-slate-600">
                    {p.description || "No description yet."}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </WorkspaceShell>
  );
}
