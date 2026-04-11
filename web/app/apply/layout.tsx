import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-dvh bg-zinc-50 text-zinc-900 antialiased`}>
      {children}
    </div>
  );
}
