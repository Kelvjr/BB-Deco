"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Announcement = {
  id?: string;
  title?: string;
  body?: string;
  status?: string;
  audience?: string;
  created_at?: string;
};

export function AnnouncementsManager() {
  const [list, setList] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  async function load() {
    setLoadErr("");
    try {
      const res = await fetch("/api/announcements", { cache: "no-store" });
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      if (!res.ok) {
        setLoadErr((data as { error?: string }).error || "Failed to load");
        return;
      }
      setList(Array.isArray(data) ? data : []);
    } catch {
      setLoadErr("Could not load announcements.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, status: "draft" }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setSaveMsg(data.error || "Save failed");
        return;
      }
      setTitle("");
      setBody("");
      setSaveMsg("Draft saved. Email/SMS sending can be wired to this record later.");
      await load();
    } catch {
      setSaveMsg("Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Compose</CardTitle>
          <CardDescription>
            Draft announcements now; connect Resend or Twilio in a follow-up to deliver.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={publish} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Open day — July"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={8}
                placeholder="Write your announcement…"
              />
            </div>
            {saveMsg ? (
              <p className="text-sm text-emerald-800">{saveMsg}</p>
            ) : null}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save draft"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Megaphone className="size-5 text-[var(--bb-primary)]" />
          <h2 className="text-lg font-semibold">Recent</h2>
        </div>
        {loadErr ? <p className="text-sm text-amber-800">{loadErr}</p> : null}
        <ul className="space-y-3">
          {list.map((a) => (
            <li key={String(a.id)}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{a.title}</CardTitle>
                    <Badge variant="secondary">{a.status || "draft"}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">
                    {a.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
        {list.length === 0 && !loadErr ? (
          <p className="text-sm text-slate-500">No announcements yet.</p>
        ) : null}
      </div>
    </div>
  );
}
