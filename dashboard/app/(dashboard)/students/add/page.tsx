import { UserPlus } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function StudentsAddPage() {
  return (
    <ComingSoon
      icon={UserPlus}
      title="Add a student"
      description="A guided form to create a student record manually — for apprentices, transfers, and walk-in admissions that bypass the public form."
      features={[
        "Personal and guardian details",
        "Program assignment with admission type",
        "Auto-generated student ID",
        "Document uploads with secure storage",
      ]}
      ctaLabel="View admissions queue"
      ctaHref="/admissions/pending"
    />
  );
}
