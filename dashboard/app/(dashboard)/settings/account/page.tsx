import { Cog } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function SettingsAccountPage() {
  return (
    <ComingSoon
      icon={Cog}
      title="Account settings"
      description="Manage your profile, notification preferences, and personal security right here. Hooks into your Clerk account today; richer controls land in Phase 2."
      features={[
        "Profile and avatar",
        "Email and password",
        "Two-factor authentication",
        "Session management",
      ]}
      ctaLabel="Open dashboard"
      ctaHref="/"
    />
  );
}
