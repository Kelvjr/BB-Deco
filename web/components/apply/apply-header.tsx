import Image from "next/image";

/** Centered brand logo from `public/logo.svg` (no header chrome). */
export function ApplyHeader() {
  return (
    <div className="flex justify-center px-4 pt-10 pb-4 md:pt-12 md:pb-6">
      <Image
        src="/logo.svg"
        alt="BB Deco & Catering Training Centre"
        width={480}
        height={160}
        className="h-24 w-auto max-w-[min(92vw,28rem)] object-contain object-center sm:h-28 md:h-32 md:max-w-[32rem]"
        priority
      />
    </div>
  );
}
