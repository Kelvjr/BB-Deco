import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BB Deco | Admissions Admin",
  description: "BB Deco Catering School admissions dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} min-h-full flex flex-col bg-[var(--page-bg)] text-[var(--foreground)]`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
