import { Bell } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function DashboardAnnouncementsPage() {
  return (
    <ComingSoon
      icon={Bell}
      title="Announcements board"
      description="The dashboard view of every announcement you publish to staff, students, and applicants — with read receipts and quick reposts."
      features={[
        "Pin urgent updates to the top",
        "Track reads by audience",
        "Schedule announcements ahead of time",
      ]}
      ctaLabel="Compose an announcement"
      ctaHref="/communications/announcements"
    />
  );
}
