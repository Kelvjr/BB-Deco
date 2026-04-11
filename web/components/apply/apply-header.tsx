import Image from "next/image";

const LOGO =
  "https://images.pexels.com/photos/4253315/pexels-photo-4253315.jpeg?auto=compress&cs=tinysrgb&w=240&h=240&fit=crop";

/** Centered logo only (no chrome header). */
export function ApplyHeader() {
  return (
    <div className="flex justify-center pt-8 pb-2">
      <div className="relative size-20 overflow-hidden rounded-2xl border border-zinc-200/80 shadow-md md:size-24">
        <Image
          src={LOGO}
          alt="BB Deco Catering School"
          fill
          className="object-cover"
          sizes="96px"
          priority
        />
      </div>
    </div>
  );
}
