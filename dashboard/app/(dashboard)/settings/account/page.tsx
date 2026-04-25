import { UserButton } from "@clerk/nextjs";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Your admin profile is powered by Clerk. Use the menu below for password, sessions,
          and security.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile & sessions</CardTitle>
          <CardDescription>Opens your Clerk account settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-11",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
