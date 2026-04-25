import { Briefcase } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function ApprenticeshipsPage() {
  return (
    <ComingSoon
      icon={Briefcase}
      eyebrow="Backend pending"
      title="Apprenticeship students"
      description="Government-sponsored apprentices will appear here once admission_type is captured by the backend. Today every approved learner is treated as Enrolled."
      features={[
        "Filter by sponsor and apprenticeship cohort",
        "Track placement and supervisor assignments",
        "Compare apprentice vs enrolled performance",
      ]}
      ctaLabel="Browse all students"
      ctaHref="/students/all"
    />
  );
}
