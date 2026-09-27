import { escapeHtml } from "./escapeHtml.ts";
import { isValidNoteId } from "./noteId";

/**
 * Validate a client-built note share URL before emailing it.
 * The fragment holds key material — callers must not log the full href.
 */
export function parseDeliverableNoteUrl(
  noteUrl: string,
  expectedNoteId: string,
  options?: { allowedHosts?: ReadonlySet<string> | readonly string[] },
): { ok: true; href: string; noteId: string } | { ok: false; error: string } {
  const trimmed = noteUrl.trim();
  if (!trimmed) return { ok: false, error: "missing_url" };
  if (!isValidNoteId(expectedNoteId)) return { ok: false, error: "invalid_note_id" };

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "invalid_url" };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, error: "invalid_protocol" };
  }

  const host = parsed.hostname.toLowerCase();
  const allowed = options?.allowedHosts;
  if (allowed) {
    const set = allowed instanceof Set ? allowed : new Set(allowed);
    const okHost =
      set.has(host) ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".pages.dev");
    if (!okHost) return { ok: false, error: "untrusted_host" };
  }

  const pathMatch = parsed.pathname.match(/^\/note\/([^/]+)\/?$/);
  if (!pathMatch || pathMatch[1] !== expectedNoteId) {
    return { ok: false, error: "note_id_mismatch" };
  }

  const fragment = parsed.hash.replace(/^#/, "").trim();
  if (fragment.length < 16) {
    return { ok: false, error: "missing_key_fragment" };
  }

  return { ok: true, href: parsed.toString(), noteId: expectedNoteId };
}

/** Same origin as the note link so logo assets resolve on prod, premium, and preview hosts. */
export function resolveNoteLinkEmailWebOrigin(noteUrl: string): string {
  try {
    return new URL(noteUrl).origin;
  } catch {
    return "https://privatenote.ai";
  }
}

const NOTE_LINK_EMAIL_FOOTER =
  "End-to-end encrypted private notes — only you and your recipients can read them.";

/** Navbar-style header: mark tile + privateNote.ai wordmark (matches site upper-left). */
function buildNavbarLogoEmailHtml(webOrigin: string): string {
  const origin = escapeHtml(webOrigin.replace(/\/$/, ""));
  const markUrl = `${origin}/brand/privateNote-logo-mark.png`;

  return [
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 0 40px;">',
    "  <tr>",
    '    <td valign="middle" style="padding:0;">',
    `      <a href="${origin}" style="text-decoration:none;">`,
    `        <img src="${markUrl}" alt="PrivateNote" width="30" height="30" border="0" style="display:block;width:30px;height:30px;border:0;outline:none;" />`,
    "      </a>",
    "    </td>",
    `    <td valign="middle" style="padding:0 0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">`,
    `      <a href="${origin}" style="text-decoration:none;color:#0000ff;">`,
    '        <span style="font-size:22px;line-height:1;font-weight:700;color:#0000ff;">privateNote</span>',
    '        <sup style="font-size:11px;line-height:0;font-weight:700;color:#0000ff;vertical-align:super;">.ai</sup>',
    "      </a>",
    "    </td>",
    "  </tr>",
    "</table>",
  ].join("\n");
}

export function buildRecipientNoteLinkEmail(input: {
  noteUrl: string;
  senderEmail: string | null;
  locale?: string;
}): { subject: string; text: string; html: string } {
  const sender =
    input.senderEmail && input.senderEmail.includes("@")
      ? input.senderEmail.trim()
      : null;
  const subject = sender
    ? `PrivateNote: ${sender} shared a private note with you`
    : "PrivateNote: someone shared a private note with you";
  const title = "You received a private note";
  const lead = sender
    ? `${sender} shared an end-to-end encrypted PrivateNote with you.`
    : "Someone shared an end-to-end encrypted PrivateNote with you.";
  const preheader = "Open this one-time encrypted PrivateNote link. Do not forward this email.";
  const bodyHint =
    "Open the one-time link below to view it. Do not forward this email — the link includes secret key material.";
  const securityNote =
    "The note may expire or become unavailable after it is opened. PrivateNote never includes the note contents in this email.";
  const cta = "Open private note";
  const webOrigin = resolveNoteLinkEmailWebOrigin(input.noteUrl);

  const text = [
    "PrivateNote.ai",
    "",
    title,
    "",
    lead,
    "",
    bodyHint,
    "",
    `${cta}:`,
    input.noteUrl,
    "",
    securityNote,
    "",
    "—",
    "PrivateNote.ai",
    NOTE_LINK_EMAIL_FOOTER,
    "www.privatenote.ai",
    "LinkedIn: https://www.linkedin.com/company/privatenote",
  ].join("\n");

  const safeUrl = escapeHtml(input.noteUrl);
  const safeTitle = escapeHtml(title);
  const safeLead = escapeHtml(lead);
  const safeBodyHint = escapeHtml(bodyHint);
  const safeSecurityNote = escapeHtml(securityNote);
  const safeFooter = escapeHtml(NOTE_LINK_EMAIL_FOOTER);
  const logoHtml = buildNavbarLogoEmailHtml(webOrigin);

  const html = [
    "<!doctype html>",
    "<html>",
    '<head><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"></head>',
    '<body style="margin:0;padding:0;background:#f3f4f6;-webkit-text-size-adjust:100%;text-size-adjust:100%;">',
    '<div style="margin:0;padding:0;min-width:100%;background:#f3f4f6;">',
    `  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>`,
    '  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f3f4f6" style="border-collapse:collapse;width:100%;min-width:100%;background:#f3f4f6;margin:0;padding:0;">',
    "    <tr>",
    '      <td align="center" bgcolor="#f3f4f6" style="background:#f3f4f6;padding:24px 16px 0;">',
    '        <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="border-collapse:collapse;width:100%;max-width:640px;background:#ffffff;">',
    '          <tr><td style="height:10px;background:#0000ff;font-size:0;line-height:0;">&nbsp;</td></tr>',
    "          <tr>",
    `            <td style="padding:42px 40px 36px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#050816;text-align:left;">`,
    `              ${logoHtml}`,
    `              <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;font-weight:800;color:#050816;">${safeTitle}</h1>`,
    `              <p style="margin:0 0 12px;font-size:15px;line-height:1.5;font-weight:400;color:#374151;">${safeLead}</p>`,
    `              <p style="margin:0 0 24px;font-size:15px;line-height:1.5;font-weight:400;color:#111827;">${safeBodyHint}</p>`,
    '              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 0 20px;">',
    "                <tr>",
    '                  <td style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:12px;padding:22px;text-align:center;">',
    '                    <p style="margin:0 0 14px;font-size:12px;line-height:1.3;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0000ff;">PrivateNote link</p>',
    '                    <p style="margin:0;">',
    `                      <a href="${safeUrl}" referrerpolicy="no-referrer" style="display:inline-block;max-width:100%;box-sizing:border-box;background:#0000ff;color:#ffffff;text-decoration:none;padding:12px 30px;border-radius:8px;font-weight:600;font-size:15px;line-height:1.25;text-align:center;">${escapeHtml(cta)}</a>`,
    "                    </p>",
    "                  </td>",
    "                </tr>",
    "              </table>",
    `              <p style="margin:0 0 16px;font-size:12px;line-height:1.5;color:#6b7280;word-break:break-all;">${safeUrl}</p>`,
    `              <p style="margin:0;font-size:13px;line-height:1.45;color:#6b7280;">${safeSecurityNote}</p>`,
    "            </td>",
    "          </tr>",
    "        </table>",
    "      </td>",
    "    </tr>",
    "    <tr>",
    `      <td align="center" bgcolor="#f3f4f6" style="background:#f3f4f6;padding:28px 16px 34px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#8a8f98;text-align:center;">`,
    '        <p style="margin:0 0 4px;font-size:13px;line-height:1.35;font-weight:700;color:#0000ff;">PrivateNote.ai</p>',
    '        <p style="margin:0 0 4px;font-size:13px;line-height:1.35;font-weight:600;color:#8a8f98;">Copyright &copy; PrivateNote.ai</p>',
    `        <p style="margin:0 0 16px;font-size:12px;line-height:1.35;color:#8a8f98;">${safeFooter}</p>`,
    '        <p style="margin:0;font-size:13px;line-height:1.35;color:#8a8f98;">',
    '          <a href="https://www.privatenote.ai" style="color:#8a8f98;text-decoration:none;">www.privatenote.ai</a>',
    '          <span style="padding:0 10px;color:#8a8f98;">|</span>',
    '          <a href="https://www.linkedin.com/company/privatenote" style="color:#8a8f98;text-decoration:none;">LinkedIn</a>',
    "        </p>",
    "      </td>",
    "    </tr>",
    "  </table>",
    "</div>",
    "</body>",
    "</html>",
  ].join("\n");

  return { subject, text, html };
}
