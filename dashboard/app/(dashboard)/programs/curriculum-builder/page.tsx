import { Layers } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function CurriculumBuilderPage() {
  return (
    <ComingSoon
      icon={Layers}
      title="Curriculum builder"
      description="A drag-and-drop canvas to compose modules, lessons, and assessments for each program — with versioning so you can iterate safely."
      features={[
        "Modules with reorderable lessons",
        "Lesson outcomes and rubrics",
        "Versioned drafts and publishing",
      ]}
      ctaLabel="Browse programs"
      ctaHref="/programs/all"
    />
  );
}
