import { BookOpen } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function ProgramsAllPage() {
  return (
    <ComingSoon
      icon={BookOpen}
      title="Programs catalog"
      description="A premium grid of every program your school offers, with student counts, durations, and curriculum at a glance. Today programs are inferred from applications; soon you'll manage them as first-class records."
      features={[
        "Editable name, description, and duration",
        "Live student counts per program",
        "Admission requirements and prerequisites",
        "Curriculum modules with lesson plans",
      ]}
      ctaLabel="Add a program"
      ctaHref="/programs/add"
    />
  );
}
