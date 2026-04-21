import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/** Chef in professional kitchen — Pexels (free license). */
const HERO_IMAGE =
  "https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg";

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 bg-white p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-slate-900"
          >
            <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
              <Image
                src="/logo.svg"
                alt=""
                width={36}
                height={36}
                className="size-8 object-contain p-0.5"
              />
            </span>
            BB Deco
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-slate-100 lg:block">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority={false}
          sizes="50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
