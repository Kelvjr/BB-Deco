"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useClerk, useSignIn } from "@clerk/nextjs";
import { formatClerkError } from "@/lib/clerk-error";
import { ALLOWED_ADMIN_EMAIL, isAllowedAdminEmail } from "@/lib/auth-constants";

export function LoginForm() {
  const router = useRouter();
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const showPasswordLengthHint = password.length > 0 && password.length < 8;

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!clerk.loaded || !signIn) return;

    const em = email.trim().toLowerCase();
    if (!isAllowedAdminEmail(em)) {
      setFormError(`Only ${ALLOWED_ADMIN_EMAIL} can sign in.`);
      return;
    }

    setSubmitting(true);
    try {
      const { error: createErr } = await signIn.create({
        identifier: em,
        password,
      });
      if (createErr) {
        setFormError(formatClerkError(createErr));
        return;
      }

      if (signIn.status !== "complete") {
        setFormError(
          "Additional verification is required. Contact your administrator.",
        );
        return;
      }

      const { error: finErr } = await signIn.finalize();
      if (finErr) {
        setFormError(formatClerkError(finErr));
        return;
      }

      router.push("/");
    } catch {
      setFormError("Could not sign in. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Sign in
        </h1>
        <p className="text-sm text-slate-500">
          BB Deco admissions dashboard.
        </p>
      </div>
      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        {formError ? (
          <p
            className="rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {formError}
          </p>
        ) : null}
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[var(--radius-sm)] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--bb-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(8,151,53,0.2)]"
            placeholder={`${ALLOWED_ADMIN_EMAIL}`}
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[var(--radius-sm)] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--bb-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(8,151,53,0.2)]"
            placeholder="••••••••"
          />
          {showPasswordLengthHint ? (
            <p className="text-xs text-slate-500">
              Password must be at least 8 characters.
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={submitting || !clerk.loaded || !signIn}
          className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--bb-primary)] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-sm text-slate-500">
          Need an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[var(--bb-primary)] underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
