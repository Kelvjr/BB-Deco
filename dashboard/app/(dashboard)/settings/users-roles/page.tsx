import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function UsersRolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Users & roles</h1>
        <p className="mt-1 text-sm text-slate-600">
          Invite reviewers and registrars. Today access is a single allow-listed admin; multi-user
          RBAC can map to Clerk organizations next.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team</CardTitle>
          <CardDescription>Coming: invite by email and assign module permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">No additional users yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
