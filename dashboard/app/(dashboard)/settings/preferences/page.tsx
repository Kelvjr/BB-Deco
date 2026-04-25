import { Sparkles } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function PreferencesPage() {
  return (
    <ComingSoon
      icon={Sparkles}
      title="Preferences"
      description="Personalize your dashboard experience — date formats, default landing page, table density, keyboard shortcuts, and more."
      features={[
        "Date and time formats",
        "Default landing tab",
        "Density and sidebar preferences",
      ]}
    />
  );
}
