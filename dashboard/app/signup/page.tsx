import { SignupForm } from "@/components/signup-form";
import { AuthPageShell } from "@/components/auth-page-shell";

export default function SignupPage() {
  return (
    <AuthPageShell>
      <SignupForm />
    </AuthPageShell>
  );
}
