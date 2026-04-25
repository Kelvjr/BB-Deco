import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default function SchoolProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          School profile
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Public-facing name and contact — wire to the API when you are ready to persist.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Branding & contact</CardTitle>
          <CardDescription>
            These fields mirror what you will expose on the apply site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">School name</label>
            <Input defaultValue="BB Deco Catering School" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Public email</label>
            <Input type="email" placeholder="info@bbdeco.org" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Textarea rows={3} placeholder="Street, city, region" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
