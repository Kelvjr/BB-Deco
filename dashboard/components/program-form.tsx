"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ProgramRow } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ProgramForm({
  mode,
  programId,
  initial,
}: {
  mode: "create" | "edit";
  programId?: string;
  initial?: ProgramRow;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [name, setName] = useState(String(initial?.name ?? ""));
  const [duration, setDuration] = useState(String(initial?.duration ?? ""));
  const [description, setDescription] = useState(String(initial?.description ?? ""));
  const [admission, setAdmission] = useState(String(initial?.admission_requirements ?? ""));
  const [status, setStatus] = useState(String(initial?.status ?? "active"));
  const [curriculumJson, setCurriculumJson] = useState(() => {
    const c = initial?.curriculum;
    try {
      return JSON.stringify(c ?? [], null, 2);
    } catch {
      return "[]";
    }
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    let curriculum: unknown = [];
    try {
      curriculum = JSON.parse(curriculumJson || "[]");
      if (!Array.isArray(curriculum)) throw new Error("Curriculum must be a JSON array.");
    } catch (pe) {
      setErr(pe instanceof Error ? pe.message : "Invalid curriculum JSON");
      setLoading(false);
      return;
    }
    try {
      const path =
        mode === "create" ? "/api/programs" : `/api/programs/${encodeURIComponent(programId!)}`;
      const res = await fetch(path, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          duration: duration || null,
          description: description || null,
          admission_requirements: admission || null,
          status: status || "active",
          curriculum,
        }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setErr(data.error || data.details || `HTTP ${res.status}`);
        return;
      }
      const newId = data.id != null ? String(data.id) : programId;
      if (newId) router.push(`/programs/${newId}`);
      else router.push("/programs/all");
      router.refresh();
    } catch {
      setErr("Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? "New program" : "Edit program"}</CardTitle>
        <CardDescription>
          Names should align with the apply form&rsquo;s program list for clean analytics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Name</label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Duration</label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 12 months"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={cn(
                  "flex h-9 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm",
                )}
              >
                <option value="active">active</option>
                <option value="draft">draft</option>
                <option value="archived">archived</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Admission requirements</label>
            <Textarea
              value={admission}
              onChange={(e) => setAdmission(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Curriculum (JSON array)</label>
            <Textarea
              value={curriculumJson}
              onChange={(e) => setCurriculumJson(e.target.value)}
              rows={8}
              className="font-mono text-xs"
            />
          </div>
          {err ? <p className="text-sm text-red-600">{err}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save program"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
