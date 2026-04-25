import { Briefcase } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function ProgramCategoriesPage() {
  return (
    <ComingSoon
      icon={Briefcase}
      title="Program categories"
      description="Group programs into pathways and tracks — Catering, Hospitality, Pastry — so the apply form and analytics roll up cleanly."
      features={[
        "Categories with custom colors and icons",
        "Pathway-level analytics",
        "Public-form ordering and visibility",
      ]}
      ctaLabel="Browse programs"
      ctaHref="/programs/all"
    />
  );
}
