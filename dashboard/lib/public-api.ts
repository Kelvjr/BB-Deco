/** For client components: browser must reach the API (use NEXT_PUBLIC_API_URL on Vercel). */
export function resolvePublicApiBase(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:4000";
  }
  return null;
}
