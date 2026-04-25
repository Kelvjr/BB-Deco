import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/settings/account", label: "Account" },
  { href: "/settings/school-profile", label: "School profile" },
  { href: "/settings/users-roles", label: "Users & roles" },
  { href: "/settings/preferences", label: "Preferences" },
  { href: "/settings/security", label: "Security" },
] as const;

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:flex-row md:px-8">
      <nav className="shrink-0 md:w-52">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Settings
        </p>
        <ul className="space-y-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
