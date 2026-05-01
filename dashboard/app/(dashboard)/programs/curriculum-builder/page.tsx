import Link from "next/link";
import { BookOpen, Clock, FlaskConical, ListChecks } from "lucide-react";
import { fetchProgramsCached } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default async function CurriculumBuilderPage() {
  const res = await fetchProgramsCached();
  const programs = res.ok ? res.data : [];

  return (
    <WorkspaceShell subtitle="Build program modules, lessons, duration, practical sessions, and requirements.">
      <div className="space-y-4">
        <Button asChild variant="outline">
          <Link href="/programs/add">Create program</Link>
        </Button>
        {programs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-slate-600">
              No programs yet. Add a program, then edit it to define modules in JSON (array of
              objects). A visual builder can sit on top later.
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {programs.map((p) => (
              <li key={String(p.id)}>
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{p.name}</CardTitle>
                      <CardDescription>{p.duration || "Duration not set"}</CardDescription>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/programs/${p.id}/edit`}>Build curriculum</Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <BookOpen className="mb-2 size-4 text-[var(--bb-primary)]" />
                      Modules and lessons
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <Clock className="mb-2 size-4 text-[var(--bb-primary)]" />
                      Duration planning
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <FlaskConical className="mb-2 size-4 text-[var(--bb-primary)]" />
                      Practical sessions
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <ListChecks className="mb-2 size-4 text-[var(--bb-primary)]" />
                      Entry requirements
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </WorkspaceShell>
  );
}
