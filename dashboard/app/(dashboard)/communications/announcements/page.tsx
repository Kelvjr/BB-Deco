import { AnnouncementsManager } from "@/components/announcements-manager";
import { WorkspaceShell } from "@/components/workspace-shell";

export const dynamic = "force-dynamic";

export default function CommunicationsAnnouncementsPage() {
  return (
    <WorkspaceShell subtitle="School-wide messages; delivery channels can be added without changing this UI.">
      <AnnouncementsManager />
    </WorkspaceShell>
  );
}
