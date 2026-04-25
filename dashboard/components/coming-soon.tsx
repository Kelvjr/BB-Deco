import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ComingSoonProps = {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export function ComingSoon({
  icon: Icon,
  eyebrow = "Coming soon",
  title,
  description,
  features = [],
  ctaLabel,
  ctaHref,
}: ComingSoonProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-[var(--card-shadow)] md:p-12">
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[rgba(8,151,53,0.08)] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-[rgba(245,158,11,0.06)] blur-3xl"
          aria-hidden
        />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge variant="soft" className="mb-4 gap-1.5">
              <Sparkles className="size-3" strokeWidth={2} />
              {eyebrow}
            </Badge>
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--bb-primary)] to-[#067d2d] text-white shadow-[0_6px_20px_-8px_rgba(8,151,53,0.55)]">
              <Icon className="size-7" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
              {description}
            </p>
            {ctaHref && ctaLabel ? (
              <div className="mt-6">
                <Button asChild size="sm" className="h-9">
                  <Link href={ctaHref}>
                    {ctaLabel}
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>

          {features.length > 0 ? (
            <ul className="grid gap-2 lg:max-w-xs">
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--bb-primary)]" />
                  <span className="text-[13px] text-slate-700">{f}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
