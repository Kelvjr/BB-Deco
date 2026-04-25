import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Preferences</h1>
        <p className="mt-1 text-sm text-slate-600">Personalize table density and date formats.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display</CardTitle>
          <CardDescription>Defaults for your session (saved to browser soon).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <p>· Date format: local</p>
          <p>· First day of week: Monday</p>
          <p>· Table density: comfortable</p>
        </CardContent>
      </Card>
    </div>
  );
}
