import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Security</h1>
        <p className="mt-1 text-sm text-slate-600">
          Password, MFA, and active sessions are managed in Clerk.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Clerk security center</CardTitle>
          <CardDescription>Use your account menu → Manage account, or the Clerk dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            <Link
              href="https://dashboard.clerk.com"
              className="font-medium text-[var(--bb-primary)] underline"
              target="_blank"
              rel="noreferrer"
            >
              Open Clerk dashboard
            </Link>
            {" "}
            for org-wide security policies and audit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
