import Image from "next/image";

const LOGO =
  "https://images.pexels.com/photos/4253315/pexels-photo-4253315.jpeg?auto=compress&cs=tinysrgb&w=240&h=240&fit=crop";

export function ApplyHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-md md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="relative size-16 overflow-hidden rounded-2xl border border-zinc-200 shadow-md md:size-[4.5rem]">
          <Image
            src={LOGO}
            alt="BB Deco Catering School"
            fill
            className="object-cover"
            sizes="72px"
            priority
          />
        </div>
      </div>
    </header>
  );
}
