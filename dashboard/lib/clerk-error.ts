/** Clerk Future API returns error objects (not always thrown). */
export function formatClerkError(err: { longMessage?: string; message?: string } | null | undefined): string {
  if (!err) return "Something went wrong.";
  const longMsg = err.longMessage;
  if (typeof longMsg === "string" && longMsg.trim()) return longMsg;
  const msg = err.message;
  if (typeof msg === "string" && msg.trim()) return msg;
  return "Something went wrong.";
}
