import {
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  ClipboardList,
  Cog,
  GraduationCap,
  Home,
  Layers,
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Plus,
  School,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";

export type NavLeaf = {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
};

export type NavGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  rootHref?: string;
  children: NavLeaf[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    defaultOpen: true,
    rootHref: "/",
    children: [
      { label: "Overview", href: "/", icon: Home },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "Announcements", href: "/dashboard/announcements", icon: Bell },
    ],
  },
  {
    id: "admissions",
    label: "Admissions",
    icon: ClipboardList,
    defaultOpen: true,
    rootHref: "/admissions/all",
    children: [
      { label: "All Applications", href: "/admissions/all" },
      { label: "Pending Review", href: "/admissions/pending" },
      { label: "Approved", href: "/admissions/approved" },
      { label: "Rejected", href: "/admissions/rejected" },
    ],
  },
  {
    id: "students",
    label: "Students",
    icon: GraduationCap,
    rootHref: "/students/all",
    children: [
      { label: "All Students", href: "/students/all" },
      { label: "Enrolled Students", href: "/students/enrolled" },
      { label: "Apprenticeship Students", href: "/students/apprenticeships" },
      { label: "Add Student", href: "/students/add", icon: UserPlus },
    ],
  },
  {
    id: "programs",
    label: "Programs",
    icon: BookOpen,
    rootHref: "/programs/all",
    children: [
      { label: "All Programs", href: "/programs/all" },
      { label: "Add Program", href: "/programs/add", icon: Plus },
      { label: "Curriculum Builder", href: "/programs/curriculum-builder", icon: Layers },
      { label: "Program Categories", href: "/programs/categories", icon: Briefcase },
    ],
  },
  {
    id: "communications",
    label: "Communications",
    icon: MessageSquare,
    rootHref: "/communications/announcements",
    children: [
      { label: "Announcements", href: "/communications/announcements", icon: Megaphone },
      { label: "Broadcast Messages", href: "/communications/broadcasts", icon: Send },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Cog,
    rootHref: "/settings/account",
    children: [
      { label: "Account", href: "/settings/account", icon: Users },
      { label: "School Profile", href: "/settings/school-profile", icon: School },
      { label: "Users & Roles", href: "/settings/users-roles", icon: ShieldCheck },
      { label: "Preferences", href: "/settings/preferences", icon: Sparkles },
    ],
  },
];

export type FlatNavEntry = {
  groupLabel: string;
  groupIcon: LucideIcon;
  leaf: NavLeaf;
};

export function flattenNav(): FlatNavEntry[] {
  const out: FlatNavEntry[] = [];
  for (const g of NAV_GROUPS) {
    for (const leaf of g.children) {
      out.push({ groupLabel: g.label, groupIcon: g.icon, leaf });
    }
  }
  return out;
}

/** Section prefix → group id. Used to map detail/legacy routes to a group. */
const SECTION_PREFIXES: { prefix: string; groupId: string }[] = [
  { prefix: "/admissions", groupId: "admissions" },
  { prefix: "/applications", groupId: "admissions" },
  { prefix: "/students", groupId: "students" },
  { prefix: "/programs", groupId: "programs" },
  { prefix: "/communications", groupId: "communications" },
  { prefix: "/settings", groupId: "settings" },
  { prefix: "/dashboard", groupId: "dashboard" },
];

export function findGroupForPath(pathname: string): NavGroup | undefined {
  for (const g of NAV_GROUPS) {
    for (const c of g.children) {
      if (pathname === c.href) return g;
    }
  }
  for (const { prefix, groupId } of SECTION_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return NAV_GROUPS.find((g) => g.id === groupId);
    }
  }
  return NAV_GROUPS[0];
}

export function findLeafForPath(pathname: string): NavLeaf | undefined {
  for (const g of NAV_GROUPS) {
    for (const c of g.children) {
      if (pathname === c.href) return c;
    }
  }
  return undefined;
}

/** Best-effort title for a route (used as the page title in the top bar). */
export function titleForPath(pathname: string): string {
  const leaf = findLeafForPath(pathname);
  if (leaf) return leaf.label;
  if (
    pathname.startsWith("/applications/") &&
    pathname !== "/applications/all"
  ) {
    return "Application detail";
  }
  const group = findGroupForPath(pathname);
  return group?.label ?? "Dashboard";
}
