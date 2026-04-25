import { Megaphone } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function AnnouncementsPage() {
  return (
    <ComingSoon
      icon={Megaphone}
      title="Announcements"
      description="Compose, schedule, and send announcements to staff, students, and applicants. Reach your community in seconds with a beautiful editor."
      features={[
        "Rich text composer with attachments",
        "Audience targeting (program, status, role)",
        "Scheduling and read-receipt tracking",
      ]}
      ctaLabel="View dashboard"
      ctaHref="/"
    />
  );
}
