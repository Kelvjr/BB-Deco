"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Megaphone,
  Plus,
  Send,
  Sparkles,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { flattenNav } from "@/lib/nav";

type QuickAction = {
  label: string;
  icon: LucideIcon;
  href: string;
  shortcut?: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Add new student", icon: UserPlus, href: "/students/add" },
  { label: "Review applications", icon: ArrowRight, href: "/admissions/pending" },
  { label: "Create program", icon: Plus, href: "/programs/add" },
  { label: "Send announcement", icon: Megaphone, href: "/communications/announcements" },
  { label: "Broadcast message", icon: Send, href: "/communications/broadcasts" },
];

export function GlobalCommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const navEntries = flattenNav();

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          {QUICK_ACTIONS.map((a) => (
            <CommandItem
              key={a.href}
              value={`action ${a.label}`}
              onSelect={() => go(a.href)}
            >
              <a.icon />
              <span>{a.label}</span>
              {a.shortcut ? (
                <CommandShortcut>{a.shortcut}</CommandShortcut>
              ) : null}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          {navEntries.map((e) => (
            <CommandItem
              key={e.leaf.href}
              value={`${e.groupLabel} ${e.leaf.label}`}
              onSelect={() => go(e.leaf.href)}
            >
              <e.groupIcon />
              <span>{e.leaf.label}</span>
              <span className="ml-auto text-xs text-[var(--muted-foreground)]">
                {e.groupLabel}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Suggestions">
          <CommandItem
            value="suggestion view dashboard"
            onSelect={() => go("/")}
          >
            <Sparkles />
            <span>Open dashboard overview</span>
          </CommandItem>
          <CommandItem
            value="suggestion review pending"
            onSelect={() => go("/admissions/pending")}
          >
            <ArrowRight />
            <span>Jump to pending applications</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function down(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);
  return { open, setOpen };
}
