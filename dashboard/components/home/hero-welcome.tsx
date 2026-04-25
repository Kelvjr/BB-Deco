"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Megaphone, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function HeroWelcome({
  firstName,
  pendingCount,
  totalApplications,
}: {
  firstName: string;
  pendingCount: number;
  totalApplications: number;
}) {
  const greeting = timeOfDayGreeting();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[var(--bb-primary)] via-[#0aa83c] to-[#067d2d] p-6 text-white shadow-[0_8px_32px_-12px_rgba(8,151,53,0.45)] md:p-8">
      <div
        className="pointer-events-none absolute -right-12 -top-12 size-64 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-12 size-72 rounded-full bg-white/5 blur-3xl"
        aria-hidden
      />

      <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:gap-8">
        <div>
          <p className="text-sm font-medium text-white/80">{greeting},</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
            {firstName}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 md:text-[15px]">
            Here&rsquo;s what&rsquo;s happening with your school today. Stay on
            top of admissions, students, and announcements.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              asChild
              variant="secondary"
              className="h-9 bg-white px-4 text-[13px] font-semibold text-slate-900 hover:bg-slate-50"
            >
              <Link href="/students/add">
                <UserPlus className="size-4" strokeWidth={2} />
                Add Student
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-9 border border-white/30 bg-white/10 px-4 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              <Link href="/admissions/pending">
                <ClipboardList className="size-4" strokeWidth={2} />
                Review Applications
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-9 border border-white/30 bg-white/10 px-4 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              <Link href="/communications/announcements">
                <Megaphone className="size-4" strokeWidth={2} />
                Send Announcement
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative flex flex-col justify-between gap-4 rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
              Pending review
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">
                {pendingCount}
              </span>
              <span className="text-xs text-white/70">
                of {totalApplications} total
              </span>
            </div>
          </div>
          <Link
            href="/admissions/pending"
            className="group inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-white/95 transition-colors hover:text-white"
          >
            Review queue
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
