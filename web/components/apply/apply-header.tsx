import Image from "next/image";

/** Centered brand logo from `public/logo.svg` (no header chrome). */
export function ApplyHeader() {
  return (
    <div className="flex justify-center pt-8 pb-2">
      <Image
        src="/logo.svg"
        alt="BB Deco & Catering Training Centre"
        width={180}
        height={56}
        className="h-14 w-auto max-w-[min(90vw,220px)] object-contain object-center"
        priority
      />
    </div>
  );
}
