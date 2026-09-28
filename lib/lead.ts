const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const stripHeaderInjection = (s: string) => s.replace(/[\r\n]+/g, " ");

/** Emails a lead to Mustafa via Resend. Resolves true once Resend accepts it. */
export async function notifyLead(
  lead: { name?: string; email?: string; phone?: string; note?: string },
  source = "chat"
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return false;
  const name = stripHeaderInjection(lead.name || "");
  const email = stripHeaderInjection(lead.email || "");
  const phone = stripHeaderInjection(lead.phone || "");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: "patharia52@gmail.com",
      ...(email ? { reply_to: email } : {}),
      subject: `New ${source} lead: ${name || email}`,
      html: `<p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Name:</strong> ${escapeHtml(name) || "—"}</p><p><strong>Phone:</strong> ${escapeHtml(phone) || "—"}</p><p><strong>Note:</strong> ${escapeHtml(lead.note || "") || "—"}</p>`,
    }),
  }).catch(() => null);
  return !!res?.ok;
}
