import { BarChart3 } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <ComingSoon
      icon={BarChart3}
      title="Analytics workspace"
      description="A deeper dive into admissions trends, conversion funnels, program demand, and apprenticeship vs enrolled splits — designed to help you spot patterns at a glance."
      features={[
        "Weekly cohort funnel from submitted to approved",
        "Program demand heatmaps and seasonality",
        "Source attribution and drop-off analysis",
        "Exportable reports for the leadership team",
      ]}
      ctaLabel="Open dashboard overview"
      ctaHref="/"
    />
  );
}
