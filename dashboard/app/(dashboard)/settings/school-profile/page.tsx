import { School } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function SchoolProfilePage() {
  return (
    <ComingSoon
      icon={School}
      title="School profile"
      description="Tell the world who BB Deco is — name, branding, contact info, social links — and use it across the public apply form and email templates."
      features={[
        "Logo, brand colors, favicon",
        "Address and contact channels",
        "Public bio for applicants",
      ]}
    />
  );
}
