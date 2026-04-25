import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { fetchProgramById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetchProgramById(id);
  if (!res.ok) notFound();
  const p = res.data;
  return (
    <WorkspaceShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{p.name}</h1>
          <p className="text-sm text-slate-500">
            {p.duration || "—"} ·{" "}
            <span className="font-mono">{(p.application_count as number) ?? 0}</span>{" "}
            applications (name match)
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{(p.status as string) || "active"}</Badge>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/programs/${id}/edit`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-700">
              {p.description || "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Admission requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {p.admission_requirements || "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Curriculum / modules</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-64 overflow-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-800">
              {JSON.stringify(p.curriculum ?? [], null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  );
}
