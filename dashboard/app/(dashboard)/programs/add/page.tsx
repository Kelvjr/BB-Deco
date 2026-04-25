import { Plus } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function ProgramsAddPage() {
  return (
    <ComingSoon
      icon={Plus}
      title="Create a program"
      description="A focused form to add a new program: name, duration, fees, intake calendar, and admission requirements — wired to a Programs CRUD endpoint in the next release."
      features={[
        "Step-by-step program builder",
        "Reusable curriculum templates",
        "Eligibility and prerequisites",
      ]}
      ctaLabel="Browse programs"
      ctaHref="/programs/all"
    />
  );
}
