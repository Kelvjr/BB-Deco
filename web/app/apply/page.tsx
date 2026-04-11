"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function resolvePublicApiBase(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:4000";
  }
  return null;
}

export default function ApplyPage() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    date_of_birth: "",
    program_applied: "",
    education_level: "",
    guardian_name: "",
    guardian_phone: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const apiBase = resolvePublicApiBase();
      if (!apiBase) {
        setMessage(
          "Applications cannot be sent because the site is missing server configuration (NEXT_PUBLIC_API_URL). Please contact the school.",
        );
        return;
      }

      const payload = {
        ...form,
        phone: form.phone || null,
        address: form.address || null,
        gender: form.gender || null,
        date_of_birth: form.date_of_birth || null,
        program_applied: form.program_applied || null,
        education_level: form.education_level || null,
        guardian_name: form.guardian_name || null,
        guardian_phone: form.guardian_phone || null,
        notes: form.notes || null,
      };

      const res = await fetch(`${apiBase}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: { details?: string; error?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text) as typeof data;
        } catch {
          throw new Error(
            `Unexpected response from server (${res.status}). Please try again later.`,
          );
        }
      }

      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to submit");
      }

      setMessage("Application submitted successfully!");
      setForm({
        full_name: "",
        phone: "",
        email: "",
        address: "",
        gender: "",
        date_of_birth: "",
        program_applied: "",
        education_level: "",
        guardian_name: "",
        guardian_phone: "",
        notes: "",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessage(
        msg === "Failed to fetch"
          ? "Could not reach the admissions server. If you are on the public website, the service may be updating—try again later, or contact the school."
          : msg,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl">
              Apply to BB Deco Catering School
            </CardTitle>
            <CardDescription>
              Fill in your details below to submit your admissions application.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="e.g. 0240000000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    name="gender"
                    placeholder="e.g. Male"
                    value={form.gender}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={form.date_of_birth}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program_applied">Program applied for</Label>
                  <Input
                    id="program_applied"
                    name="program_applied"
                    placeholder="e.g. Culinary Arts"
                    value={form.program_applied}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education_level">Education level</Label>
                  <Input
                    id="education_level"
                    name="education_level"
                    placeholder="e.g. High School"
                    value={form.education_level}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardian_name">Guardian name</Label>
                  <Input
                    id="guardian_name"
                    name="guardian_name"
                    placeholder="Enter guardian name"
                    value={form.guardian_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardian_phone">Guardian phone</Label>
                  <Input
                    id="guardian_phone"
                    name="guardian_phone"
                    placeholder="e.g. 0200000000"
                    value={form.guardian_phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Additional notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Anything else you want us to know"
                    value={form.notes}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-fit"
                >
                  {loading ? "Submitting..." : "Submit application"}
                </Button>

                {message ? (
                  <p className="text-sm text-muted-foreground">{message}</p>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
