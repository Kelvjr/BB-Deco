"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { formatClerkError } from "@/lib/clerk-error";
import { ALLOWED_ADMIN_EMAIL, isAllowedAdminEmail } from "@/lib/auth-constants";

export function SignupForm() {
  const router = useRouter();
  const clerk = useClerk();
  const { signUp } = useSignUp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerify, setPendingVerify] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const showPasswordLengthHint = password.length > 0 && password.length < 8;
  const showConfirmMismatch =
    confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!clerk.loaded || !signUp) return;

    const full = fullName.trim();
    const em = email.trim().toLowerCase();
    if (!full) {
      setFormError("Full name is required.");
      return;
    }
    if (!isAllowedAdminEmail(em)) {
      setFormError(`Only ${ALLOWED_ADMIN_EMAIL} can create an account.`);
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const [firstNameToken, ...lastNameParts] = full.split(/\s+/);
    const firstName = firstNameToken ?? "";
    const lastName = lastNameParts.join(" ").trim() || undefined;

    setSubmitting(true);
    try {
      const { error: createErr } = await signUp.create({
        firstName,
        lastName,
        emailAddress: em,
        password,
      });
      if (createErr) {
        setFormError(formatClerkError(createErr));
        return;
      }

      if (signUp.status === "complete") {
        const { error: finErr } = await signUp.finalize();
        if (finErr) {
          setFormError(formatClerkError(finErr));
          return;
        }
        router.push("/");
        return;
      }

      const { error: sendErr } = await signUp.verifications.sendEmailCode();
      if (sendErr) {
        setFormError(formatClerkError(sendErr));
        return;
      }
      setPendingVerify(true);
    } catch {
      setFormError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!clerk.loaded || !signUp || !code.trim()) return;
    setSubmitting(true);
    try {
      const { error: verErr } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });
      if (verErr) {
        setFormError(formatClerkError(verErr));
        return;
      }

      if (signUp.status !== "complete") {
        setFormError("Verification incomplete. Try again.");
        return;
      }

      const { error: finErr } = await signUp.finalize();
      if (finErr) {
        setFormError(formatClerkError(finErr));
        return;
      }
      router.push("/");
    } catch {
      setFormError("Could not verify email.");
    } finally {
      setSubmitting(false);
    }
  }

  if (pendingVerify) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Verify your email
          </h1>
          <p className="text-sm text-slate-500">
            Enter the code we sent to{" "}
            <span className="font-medium text-slate-700">{email.trim()}</span>
            .
          </p>
        </div>
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          {formError ? (
            <p
              className="rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {formError}
            </p>
          ) : null}
          <div className="grid gap-2">
            <label
              htmlFor="verify-code"
              className="text-sm font-medium text-slate-700"
            >
              Verification code
            </label>
            <input
              id="verify-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="rounded-[var(--radius-sm)] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--bb-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(8,151,53,0.2)]"
              placeholder="Enter code"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !clerk.loaded || !signUp}
            className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--bb-primary)] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? "Verifying…" : "Continue"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Create an account
        </h1>
        <p className="text-sm text-slate-500">
          BB Deco admissions — admin access only.
        </p>
      </div>
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        {formError ? (
          <p
            className="rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {formError}
          </p>
        ) : null}
        <div className="grid gap-2">
          <label
            htmlFor="full-name"
            className="text-sm font-medium text-slate-700"
          >
            Full name
          </label>
          <input
            id="full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-[var(--radius-sm)] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--bb-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(8,151,53,0.2)]"
            placeholder="Full name"
          />
        </div>
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
            autoComplete="new-password"
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
        <div className="grid gap-2">
          <label
            htmlFor="confirm"
            className="text-sm font-medium text-slate-700"
          >
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-[var(--radius-sm)] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--bb-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(8,151,53,0.2)]"
            placeholder="••••••••"
          />
          {showConfirmMismatch ? (
            <p className="text-xs text-amber-800">
              Please confirm your password — it must match the field above.
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={submitting || !clerk.loaded || !signUp}
          className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--bb-primary)] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--bb-primary)] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
