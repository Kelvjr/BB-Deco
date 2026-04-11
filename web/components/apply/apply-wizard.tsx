"use client";

import { Manrope } from "next/font/google";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplyFooter } from "@/components/apply/apply-footer";
import { ApplyHeader } from "@/components/apply/apply-header";
import {
  EDUCATION_OPTIONS,
  GENDER_OPTIONS,
  PROGRAM_OPTIONS,
} from "@/components/apply/constants";
import { ImageCropModal } from "@/components/apply/image-crop-modal";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const DRAFT_KEY = "bbdeco_apply_draft_v1";
const TOTAL_STEPS = 5;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const HERO_SIDE =
  "https://images.pexels.com/photos/329976/pexels-photo-329976.jpeg?auto=compress&cs=tinysrgb&w=800";

function resolvePublicApiBase(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:4000";
  }
  return null;
}

type FormState = {
  firstName: string;
  lastName: string;
  otherNames: string;
  gender: string;
  dateOfBirth: string;
  identityPhotoDataUrl: string | null;
  phone: string;
  email: string;
  address: string;
  programApplied: string;
  educationLevel: string;
  institution: string;
  guardianName: string;
  guardianPhone: string;
  consentAccurate: boolean;
  consentCommunications: boolean;
  additionalNotes: string;
};

function emptyForm(): FormState {
  return {
    firstName: "",
    lastName: "",
    otherNames: "",
    gender: "",
    dateOfBirth: "",
    identityPhotoDataUrl: null,
    phone: "",
    email: "",
    address: "",
    programApplied: "",
    educationLevel: "",
    institution: "",
    guardianName: "",
    guardianPhone: "",
    consentAccurate: false,
    consentCommunications: false,
    additionalNotes: "",
  };
}

const inputClass =
  "w-full rounded-xl border border-stone-200/90 bg-white px-4 py-3 text-base text-zinc-900 shadow-[0px_0px_0px_1px_rgba(191,202,186,0.25)] outline-none transition focus:border-[#089735]/50 focus:ring-2 focus:ring-[#089735]/25";

const labelClass =
  "text-xs font-bold uppercase tracking-wide text-neutral-700";

/** Primary / secondary actions — same on every step. */
const primaryBtnClass =
  "gap-2 bg-[#089735] px-8 py-6 text-base font-bold text-white shadow-sm hover:bg-[#067d2d]";
const backBtnClass =
  "gap-2 border border-[#089735]/35 bg-white text-[#067d2d] hover:bg-[#089735]/10";

export function ApplyWizard() {
  const [phase, setPhase] = useState<"form" | "success">("form");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftMsg, setDraftMsg] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { step?: number; form?: Partial<FormState> };
      if (parsed.form) setForm((f) => ({ ...f, ...parsed.form }));
      if (typeof parsed.step === "number" && parsed.step >= 1 && parsed.step <= 5) {
        setStep(parsed.step);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, form }));
      setDraftMsg("Progress saved on this device.");
      setTimeout(() => setDraftMsg(""), 3500);
    } catch {
      setDraftMsg("Could not save draft.");
    }
  }, [step, form]);

  const openFilePicker = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG or PNG).");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Photo must be 5MB or smaller.");
      return;
    }
    setError("");
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCropOpen(true);
  };

  const onCropDone = (dataUrl: string) => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setForm((f) => ({ ...f, identityPhotoDataUrl: dataUrl }));
  };

  const onCropClose = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setCropOpen(false);
  };

  const fullName = useMemo(() => {
    return [form.firstName.trim(), form.lastName.trim()]
      .filter(Boolean)
      .join(" ");
  }, [form.firstName, form.lastName]);

  const notesPayload = useMemo(() => {
    const parts: string[] = [];
    if (form.otherNames.trim()) {
      parts.push(`Other names: ${form.otherNames.trim()}`);
    }
    if (form.institution.trim()) {
      parts.push(`Current / last institution: ${form.institution.trim()}`);
    }
    if (form.additionalNotes.trim()) {
      parts.push(form.additionalNotes.trim());
    }
    return parts.length ? parts.join("\n\n") : null;
  }, [form.otherNames, form.institution, form.additionalNotes]);

  const validateStep = (s: number): string | null => {
    if (s === 1) {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        return "Please enter your first and last name.";
      }
      if (!form.gender) return "Please select your gender.";
      if (!form.dateOfBirth) return "Please enter your date of birth.";
      if (!form.identityPhotoDataUrl) {
        return "Please upload and crop your identity portrait.";
      }
    }
    if (s === 2) {
      if (!form.phone.trim()) return "Please enter your phone number.";
      if (!form.email.trim()) return "Please enter your email address.";
      if (!form.address.trim()) return "Please enter your full address.";
    }
    if (s === 3) {
      if (!form.programApplied) return "Please select a program.";
      if (!form.educationLevel) return "Please select your education level.";
    }
    if (s === 4) {
      if (!form.guardianName.trim() || !form.guardianPhone.trim()) {
        return "Please enter guardian name and phone.";
      }
    }
    if (s === 5) {
      if (!form.consentAccurate || !form.consentCommunications) {
        return "Please confirm both agreements to submit.";
      }
    }
    return null;
  };

  const goNext = () => {
    const v = validateStep(step);
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const goBack = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = async () => {
    const v = validateStep(5);
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const apiBase = resolvePublicApiBase();
      if (!apiBase) {
        setError(
          "This site is not configured to send applications yet. Please contact BB Deco.",
        );
        return;
      }
      if (!fullName) {
        setError("Please complete your name on step 1.");
        return;
      }

      const payload = {
        full_name: fullName,
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        gender: form.gender || null,
        date_of_birth: form.dateOfBirth || null,
        program_applied: form.programApplied || null,
        education_level: form.educationLevel || null,
        guardian_name: form.guardianName.trim(),
        guardian_phone: form.guardianPhone.trim(),
        notes: notesPayload,
        identity_photo: form.identityPhotoDataUrl,
        institution: form.institution.trim() || null,
        consent_accurate: form.consentAccurate,
        consent_communications: form.consentCommunications,
      };

      const res = await fetch(`${apiBase}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let data: { details?: string; error?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text) as typeof data;
        } catch {
          throw new Error(`Unexpected server response (${res.status}).`);
        }
      }
      if (!res.ok) {
        throw new Error(
          data.details ||
            data.error ||
            "Submission failed. If this continues, run the latest database migration for the apply form.",
        );
      }
      localStorage.removeItem(DRAFT_KEY);
      setPhase("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(
        msg === "Failed to fetch"
          ? "Could not reach the server. Check your connection and try again."
          : msg,
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPhase("form");
    setStep(1);
    setForm(emptyForm());
    setError("");
    localStorage.removeItem(DRAFT_KEY);
  };

  if (phase === "success") {
    return (
      <div className="flex min-h-dvh flex-col">
        <ApplyHeader />
        <main className="flex flex-1 flex-col items-center px-4 py-16 md:py-24">
          <div className="relative mx-auto max-w-xl text-center">
            <div className="pointer-events-none absolute -left-24 -top-24 size-56 rounded-full bg-[#089735]/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 top-0 size-48 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="relative mx-auto flex size-28 items-center justify-center rounded-full bg-[#089735] shadow-lg ring-8 ring-white">
              <Check className="size-14 text-white" strokeWidth={2.5} />
            </div>
            <h1
              className={cn(
                manrope.className,
                "mt-10 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl md:leading-tight",
              )}
            >
              Application submitted successfully!
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-700">
              Your application has been received and is being reviewed. We&apos;ll
              get back to you via email shortly.
            </p>
            <Button
              type="button"
              className={cn("mt-10", primaryBtnClass)}
              onClick={resetForm}
            >
              Go back home
            </Button>
          </div>
        </main>
        <ApplyFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <ApplyHeader />

      <main className="flex flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto w-full max-w-5xl">
          {error ? (
            <div
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <div className="mb-10 w-full md:mx-auto md:w-[60%]">
            <StepDots current={step} manropeClass={manrope.className} />
            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 border-[#089735]/35 text-[#067d2d] hover:bg-[#089735]/10"
                onClick={saveDraft}
              >
                <Save className="size-4" />
                Save progress
              </Button>
            </div>
            {draftMsg ? (
              <p className="mt-2 text-right text-xs text-[#067d2d]">{draftMsg}</p>
            ) : null}
          </div>

          {/* Step 1 */}
          {step === 1 ? (
            <div className="overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-sm md:flex">
              <div className="relative hidden w-full max-w-sm flex-col justify-between bg-zinc-100 p-10 md:flex md:w-[288px]">
                <div>
                  <h2
                    className={cn(
                      manrope.className,
                      "text-3xl font-extrabold leading-tight text-zinc-900",
                    )}
                  >
                    Your culinary journey starts here
                  </h2>
                  <p className="mt-6 text-base leading-relaxed text-neutral-700">
                    Personal information is the first ingredient in your application.
                    Please ensure all details match your official identification
                    documents.
                  </p>
                </div>
                <div className="relative mt-10 h-44 overflow-hidden rounded-2xl">
                  <Image
                    src={HERO_SIDE}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="288px"
                  />
                </div>
              </div>
              <div className="flex-1 bg-stone-50 p-8 md:p-12">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={onFile}
                />
                <ImageCropModal
                  open={cropOpen}
                  imageSrc={cropSrc}
                  onClose={onCropClose}
                  onComplete={onCropDone}
                />

                <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="flex size-32 shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300/80 bg-gray-50 text-center transition hover:border-[#089735]/50 hover:bg-white"
                  >
                    {form.identityPhotoDataUrl ? (
                      <Image
                        src={form.identityPhotoDataUrl}
                        alt="Portrait preview"
                        width={128}
                        height={128}
                        unoptimized
                        className="size-full rounded-xl object-cover"
                      />
                    ) : (
                      <>
                        <Camera className="size-8 text-neutral-600" />
                        <span className="mt-2 text-[10px] font-bold uppercase tracking-wide text-neutral-700">
                          Upload
                        </span>
                      </>
                    )}
                  </button>
                  <div>
                    <h3
                      className={cn(
                        manrope.className,
                        "text-lg font-bold text-zinc-900",
                      )}
                    >
                      Identity portrait
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                      A clear front-facing photo for your student records. Max 5MB.
                      You&apos;ll crop to a square after choosing a file.
                    </p>
                    {form.identityPhotoDataUrl ? (
                      <Button
                        type="button"
                        variant="link"
                        className="mt-2 h-auto p-0 text-[#067d2d]"
                        onClick={openFilePicker}
                      >
                        Replace photo
                      </Button>
                    ) : null}
                  </div>
                </div>

                <hr className="my-8 border-zinc-200" />

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    <div>
                      <label className={labelClass}>First name</label>
                      <input
                        className={cn(inputClass, "mt-2")}
                        placeholder="e.g. Julian"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, firstName: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Last name</label>
                      <input
                        className={cn(inputClass, "mt-2")}
                        placeholder="e.g. Mensah"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, lastName: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <label className={labelClass}>Other names</label>
                      <span className="text-[10px] font-bold uppercase text-neutral-500">
                        Optional
                      </span>
                    </div>
                    <input
                      className={cn(inputClass, "mt-2")}
                      placeholder="Middle names or aliases"
                      value={form.otherNames}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, otherNames: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    <div>
                      <label className={labelClass}>Gender</label>
                      <div className="relative mt-2">
                        <select
                          className={cn(
                            inputClass,
                            "appearance-none pr-10 font-normal text-zinc-900",
                          )}
                          value={form.gender}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, gender: e.target.value }))
                          }
                        >
                          <option value="">Select gender</option>
                          {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-neutral-500" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Date of birth</label>
                      <input
                        type="date"
                        className={cn(inputClass, "mt-2")}
                        value={form.dateOfBirth}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <Button
                    type="button"
                    className={primaryBtnClass}
                    onClick={goNext}
                  >
                    Next
                    <ArrowRight className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Step 2 */}
          {step === 2 ? (
            <div className="space-y-14">
              <div className="mx-auto w-full md:w-[55%] md:max-w-xl">
                <div className="relative overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white p-8 shadow-lg md:p-10">
                  <div className="pointer-events-none absolute -right-8 -top-16 size-40 rounded-full bg-[#089735]/10 blur-2xl" />
                  <h2
                    className={cn(
                      manrope.className,
                      "text-3xl font-semibold text-zinc-900 md:text-4xl",
                    )}
                  >
                    Reach out &amp; connect
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    Provide your primary contact details so we can coordinate your visit
                    and follow up about your application.
                  </p>
                  <div className="mt-8 space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Phone number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-600" />
                        <input
                          className={cn(inputClass, "pl-11")}
                          placeholder="+233 24 000 0000"
                          value={form.phone}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-600" />
                        <input
                          type="email"
                          className={cn(inputClass, "pl-11")}
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Full address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 size-4 text-neutral-600" />
                        <textarea
                          className={cn(inputClass, "min-h-[120px] resize-y pl-11")}
                          placeholder="Street, city, region, postal code"
                          value={form.address}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, address: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 flex flex-wrap justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className={backBtnClass}
                      onClick={goBack}
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </Button>
                    <Button type="button" className={primaryBtnClass} onClick={goNext}>
                      Next
                      <ArrowRight className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2 md:items-center md:gap-10">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-lg">
                  <Image
                    src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div>
                  <h3
                    className={cn(
                      manrope.className,
                      "text-2xl font-semibold text-zinc-900",
                    )}
                  >
                    Privacy &amp; security
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-neutral-700">
                    Your details are used only for admissions and school records at BB
                    Deco &amp; Catering Training Centre. We do not sell your contact
                    information to third parties.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-zinc-100">
                      <Mail className="size-5 text-[#067d2d]" aria-hidden />
                    </div>
                    <div className="flex size-11 items-center justify-center rounded-xl bg-zinc-100">
                      <Phone className="size-5 text-[#067d2d]" aria-hidden />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Step 3 */}
          {step === 3 ? (
            <div>
              <div className="md:flex md:gap-12">
                <div className="max-w-md shrink-0">
                  <h2
                    className={cn(
                      manrope.className,
                      "text-4xl font-extrabold leading-tight text-zinc-900 md:text-5xl md:leading-[1.1]",
                    )}
                  >
                    Academic{" "}
                    <span className="text-[#067d2d]">heritage.</span>
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-neutral-700">
                    Tell us about your background and which programme you&apos;d like
                    to pursue at BB Deco.
                  </p>
                  <div className="relative mt-8 hidden h-56 overflow-hidden rounded-3xl shadow-xl md:block">
                    <Image
                      src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=700"
                      alt=""
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                </div>
                <div className="mt-10 flex-1 rounded-[28px] border border-stone-200/60 bg-zinc-100 p-8 shadow-sm md:mt-0 md:p-10">
                  <div className="space-y-8">
                    <div>
                      <label className={labelClass}>Program applied for</label>
                      <div className="relative mt-2">
                        <select
                          className={cn(
                            inputClass,
                            "py-4 font-semibold text-zinc-900 appearance-none pr-10",
                          )}
                          value={form.programApplied}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              programApplied: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select a program</option>
                          {PROGRAM_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[#067d2d]" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Highest education level</label>
                      <div className="relative mt-2">
                        <select
                          className={cn(
                            inputClass,
                            "py-4 font-semibold text-zinc-900 appearance-none pr-10",
                          )}
                          value={form.educationLevel}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              educationLevel: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select level</option>
                          {EDUCATION_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[#067d2d]" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Current institution / last attended
                      </label>
                      <input
                        className={cn(inputClass, "mt-2 font-semibold")}
                        placeholder="Institution name"
                        value={form.institution}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, institution: e.target.value }))
                        }
                      />
                    </div>
                    <div className="flex flex-wrap justify-between gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className={backBtnClass}
                        onClick={goBack}
                      >
                        <ArrowLeft className="size-4" />
                        Back
                      </Button>
                      <Button type="button" className={primaryBtnClass} onClick={goNext}>
                        Next
                        <ArrowRight className="size-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Step 4 */}
          {step === 4 ? (
            <div>
              <div className="mx-auto max-w-2xl rounded-[28px] border border-zinc-200/80 bg-zinc-100 p-1 shadow-md">
                <div className="rounded-3xl bg-white px-8 py-12 shadow-sm md:px-14 md:py-16">
                  <h2
                    className={cn(
                      manrope.className,
                      "text-3xl font-extrabold text-zinc-900 md:text-4xl md:leading-tight",
                    )}
                  >
                    Guardian information
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-500">
                    Emergency contact or legal guardian for school records.
                  </p>
                  <div className="mt-10 space-y-8">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-10">
                      <label className={`${labelClass} md:w-36`}>
                        Guardian name
                      </label>
                      <div className="relative flex-1">
                        <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <input
                          className={cn(inputClass, "pl-11")}
                          placeholder="Full legal name"
                          value={form.guardianName}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              guardianName: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-10">
                      <label className={`${labelClass} md:w-36`}>
                        Guardian phone
                      </label>
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <input
                          className={cn(inputClass, "pl-11")}
                          placeholder="+233 20 000 0000"
                          value={form.guardianPhone}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              guardianPhone: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-14 flex flex-wrap justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className={backBtnClass}
                      onClick={goBack}
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </Button>
                    <Button type="button" className={primaryBtnClass} onClick={goNext}>
                      Next
                      <ArrowRight className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Step 5 */}
          {step === 5 ? (
            <div className="mx-auto max-w-3xl">
              <h2
                className={cn(
                  manrope.className,
                  "text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl",
                )}
              >
                Final consent
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Review the agreements below, then submit your application.
              </p>

              <div className="relative mt-8 overflow-hidden rounded-[28px] border border-stone-200/60 bg-white px-8 py-10 shadow-xl md:px-16 md:py-12">
                  <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[#089735]/10 blur-2xl" />
                  <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-[#089735]/20">
                      <Check className="size-7 text-[#067d2d]" strokeWidth={2.5} />
                    </div>
                    <p
                      className={cn(
                        manrope.className,
                        "mt-6 text-2xl font-bold text-zinc-900",
                      )}
                    >
                      Almost there!
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-neutral-700">
                      BB Deco &amp; Catering Training Centre will use your responses only
                      for admissions.
                    </p>
                  </div>

                  <div className="mx-auto mt-10 max-w-xl space-y-6">
                    <label className="flex cursor-pointer gap-4 rounded-xl border border-zinc-100 p-5 transition hover:bg-zinc-50">
                      <input
                        type="checkbox"
                        className="mt-1 size-5 shrink-0 rounded border-stone-300 accent-[#089735]"
                        checked={form.consentAccurate}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            consentAccurate: e.target.checked,
                          }))
                        }
                      />
                      <span>
                        <span className="font-bold text-zinc-900">
                          Information accuracy
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-neutral-700">
                          I certify that the information in this application is true and
                          complete. I understand that misrepresentation may lead to
                          rejection.
                        </span>
                      </span>
                    </label>
                    <label className="flex cursor-pointer gap-4 rounded-xl border border-zinc-100 p-5 transition hover:bg-zinc-50">
                      <input
                        type="checkbox"
                        className="mt-1 size-5 shrink-0 rounded border-stone-300 accent-[#089735]"
                        checked={form.consentCommunications}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            consentCommunications: e.target.checked,
                          }))
                        }
                      />
                      <span>
                        <span className="font-bold text-zinc-900">
                          Communication agreement
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-neutral-700">
                          I agree to receive messages about my application status and
                          related opportunities using the contact details I provided.
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="mx-auto mt-8 max-w-xl rounded-xl bg-zinc-100 p-5 text-center text-xs font-semibold uppercase leading-relaxed tracking-tight text-neutral-700">
                    By clicking &quot;Submit application&quot;, you agree to our{" "}
                    <a className="text-[#067d2d] underline" href="#">
                      Privacy policy
                    </a>{" "}
                    and{" "}
                    <a className="text-[#067d2d] underline" href="#">
                      Terms of enrollment
                    </a>
                    .
                  </div>

                  <div className="mx-auto mt-8 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-center">
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(backBtnClass, "font-bold")}
                      onClick={goBack}
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      disabled={loading}
                      className={cn(
                        primaryBtnClass,
                        "flex-1 py-7 text-lg font-extrabold disabled:opacity-60",
                      )}
                      onClick={submit}
                    >
                      {loading ? "Submitting…" : "Submit application"}
                    </Button>
                  </div>

                  <div className="mx-auto mt-8 max-w-xl">
                    <label className={labelClass}>Anything else? (optional)</label>
                    <textarea
                      className={cn(inputClass, "mt-2 min-h-[100px] resize-y")}
                      placeholder="Scholarship interest, dietary needs for tastings, etc."
                      value={form.additionalNotes}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          additionalNotes: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
            </div>
          ) : null}
        </div>
      </main>

      <ApplyFooter />
    </div>
  );
}

const STEP_LABELS = ["Identity", "Contact", "Education", "Guardian", "Consent"] as const;

function StepDots({
  current,
  manropeClass,
}: {
  current: number;
  manropeClass: string;
}) {
  return (
    <div className="relative w-full pb-6 pt-2">
      <div className="absolute left-0 right-0 top-7 h-2 rounded-full bg-zinc-200" />
      <div
        className="absolute left-0 top-7 h-2 rounded-full bg-gradient-to-r from-[#067d2d] to-[#089735] transition-all duration-300"
        style={{
          width: `${((current - 1) / (STEP_LABELS.length - 1)) * 100}%`,
          maxWidth: "100%",
        }}
      />
      <div className="relative flex justify-between">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;
          return (
            <div key={label} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full text-sm font-bold shadow-sm transition md:size-11",
                  done || active
                    ? "bg-[#067d2d] text-white ring-2 ring-white"
                    : "bg-zinc-200 text-neutral-600",
                  active && "size-12 scale-105 ring-4 ring-[#089735]/25 md:size-12",
                )}
              >
                {done ? <Check className="size-5" /> : n}
              </div>
              <span
                className={cn(
                  manropeClass,
                  "mt-2 max-w-[4.5rem] text-center text-[10px] font-bold uppercase leading-tight tracking-wide",
                  active ? "text-zinc-900" : "text-neutral-600",
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
