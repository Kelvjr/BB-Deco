import { ShieldCheck } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function UsersRolesPage() {
  return (
    <ComingSoon
      icon={ShieldCheck}
      title="Users & roles"
      description="Invite teammates and assign roles like Admin, Reviewer, and Registrar — with granular permissions across admissions, students, and programs."
      features={[
        "Invite by email with role presets",
        "Per-module permissions",
        "Audit log of role changes",
      ]}
    />
  );
}
