import { Send } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function BroadcastsPage() {
  return (
    <ComingSoon
      icon={Send}
      title="Broadcast messages"
      description="Send transactional emails and SMS to applicants and students from one place — with delivery analytics and templates."
      features={[
        "Email + SMS multichannel delivery",
        "Personalisation tokens and templates",
        "Delivery analytics and bounces",
      ]}
      ctaLabel="View announcements"
      ctaHref="/communications/announcements"
    />
  );
}
