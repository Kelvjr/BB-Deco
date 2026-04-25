import Link from "next/link";
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
    <WorkspaceShell subtitle="Attach modules to each program. Editing uses the program form’s curriculum JSON for now.">
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
          <ul className="space-y-3">
            {programs.map((p) => (
              <li key={String(p.id)}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{p.name}</CardTitle>
                      <CardDescription>Edit curriculum JSON on the program.</CardDescription>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/programs/${p.id}/edit`}>Edit modules</Link>
                    </Button>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </WorkspaceShell>
  );
}
