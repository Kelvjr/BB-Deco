const { Resend } = require("resend");

const SCHOOL = "BB Deco & Catering Training Centre";

/**
 * Sends the “application received” transactional email via Resend.
 * @returns {{ sent: true, id?: string } | { sent: false, skipped: true, reason: string } | { sent: false, error: unknown }}
 */
async function sendApplicationReceivedEmail({
  to,
  fullName,
  programApplied,
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();

  if (!apiKey || !from) {
    console.warn(
      "[email] Skipping receipt email: set RESEND_API_KEY and RESEND_FROM on the server.",
    );
    return { sent: false, skipped: true, reason: "not_configured" };
  }

  const email = typeof to === "string" ? to.trim() : "";
  if (!email || !email.includes("@")) {
    console.warn("[email] Skipping receipt email: invalid applicant email.");
    return { sent: false, skipped: true, reason: "invalid_to" };
  }

  const displayName = (fullName && String(fullName).trim()) || "Applicant";
  const first = displayName.split(/\s+/)[0];
  const program =
    programApplied && String(programApplied).trim()
      ? String(programApplied).trim()
      : null;

  const subject = `We received your application — ${SCHOOL}`;

  const text = [
    `Hi ${first},`,
    "",
    `Thank you for applying to ${SCHOOL}.`,
    "",
    "We have received your application and our admissions team will review it shortly.",
    "We will get back to you via email as soon as possible.",
    "",
    program ? `Program: ${program}` : null,
    program ? "" : null,
    "If you did not submit this application, you can ignore this message.",
    "",
    `— ${SCHOOL}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const programHtml = program
    ? `<p style="margin:16px 0 0;color:#3f3f46;font-size:15px;line-height:1.5;"><strong>Program</strong><br/>${escapeHtml(program)}</p>`
    : "";

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fafafa;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafafa;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 8px;">
              <p style="margin:0;color:#089735;font-size:13px;font-weight:600;letter-spacing:0.02em;">${escapeHtml(SCHOOL)}</p>
              <h1 style="margin:12px 0 0;font-size:22px;line-height:1.25;color:#18181b;">We received your application</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;">
              <p style="margin:0;color:#3f3f46;font-size:15px;line-height:1.6;">Hi ${escapeHtml(first)},</p>
              <p style="margin:16px 0 0;color:#3f3f46;font-size:15px;line-height:1.6;">Thank you for applying. We have safely received your submission and our admissions team will review it shortly.</p>
              <p style="margin:16px 0 0;color:#3f3f46;font-size:15px;line-height:1.6;">We will reply to you at this email address as soon as we can.</p>
              ${programHtml}
              <p style="margin:24px 0 0;color:#71717a;font-size:13px;line-height:1.5;">If you did not submit this application, you can ignore this message.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const resend = new Resend(apiKey);
  const replyTo = process.env.RESEND_REPLY_TO?.trim();

  const { data, error } = await resend.emails.send({
    from,
    to: [email],
    subject,
    html,
    text,
    ...(replyTo ? { reply_to: replyTo } : {}),
  });

  if (error) {
    return { sent: false, error };
  }
  return { sent: true, id: data?.id };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { sendApplicationReceivedEmail };
