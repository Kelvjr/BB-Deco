"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AddStudentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState("");
  const [admissionType, setAdmissionType] = useState<"enrolled" | "apprenticeship">(
    "enrolled",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email: email || null,
          phone: phone || null,
          program_applied: program || null,
          admission_type: admissionType,
        }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setMessage(data.error || data.details || `Error ${res.status}`);
        return;
      }
      const id = data.id != null ? String(data.id) : null;
      if (id) router.push(`/students/${encodeURIComponent(id)}`);
      else {
        setMessage("Created. Open the student directory to find the new record.");
        router.refresh();
      }
    } catch {
      setMessage("Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>New student</CardTitle>
        <CardDescription>
          Creates a BB student ID and profile. Optional fields can be filled in later on
          the profile page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium text-slate-700">
              Full name
            </label>
            <Input
              id="full_name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jane Smith"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Phone
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="program" className="text-sm font-medium text-slate-700">
              Program / course
            </label>
            <Input
              id="program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Match your catalog program name for counts"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="admission" className="text-sm font-medium text-slate-700">
              Admission type
            </label>
            <select
              id="admission"
              value={admissionType}
              onChange={(e) =>
                setAdmissionType(e.target.value as "enrolled" | "apprenticeship")
              }
              className={cn(
                "flex h-9 w-full rounded-md border border-[var(--border)] bg-white px-3 py-1 text-sm shadow-sm",
                "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none",
              )}
            >
              <option value="enrolled">Enrolled (direct applicant)</option>
              <option value="apprenticeship">Apprenticeship (government)</option>
            </select>
          </div>
          {message ? (
            <p className="text-sm text-amber-800" role="status">
              {message}
            </p>
          ) : null}
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Creating…" : "Create student"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
