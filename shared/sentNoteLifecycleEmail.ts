import { escapeHtml } from "./escapeHtml.ts";

export type SentNoteLifecycleEmailEvent =
  | "opened"
  | "destroyed"
  | "opened_destroyed"
  | "expired"
  | "attachment_downloaded"
  | "receipt_acknowledged"
  | "unopened_reminder";

const LIFECYCLE_EMAIL_FOOTER =
  "End-to-end encrypted private notes — only you and your recipients can read them.";

function resolveWebOrigin(raw: string | null | undefined): string {
  const trimmed = typeof raw === "string" ? raw.trim().replace(/\/$/, "") : "";
  if (!trimmed) return "https://privatenote.ai";
  try {
    return new URL(trimmed).origin;
  } catch {
    return "https://privatenote.ai";
  }
}

function formatEventTimeUtc(eventAt: string): string {
  const date = new Date(eventAt);
  if (Number.isNaN(date.getTime())) return eventAt;
  return `${new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date)} UTC`;
}

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

function detailRowHtml(label: string, value: string): string {
  return [
    '<tr>',
    `  <td style="padding:6px 0;font-size:13px;line-height:1.4;color:#6b7280;vertical-align:top;width:118px;">${escapeHtml(label)}</td>`,
    `  <td style="padding:6px 0;font-size:13px;line-height:1.4;color:#111827;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>`,
    "</tr>",
  ].join("");
}

export function buildSentNoteLifecycleEmailContent(input: {
  event: SentNoteLifecycleEmailEvent;
  label: string;
  eventAt: string;
  country?: string | null;
  deviceClass?: string | null;
  browser?: string | null;
  webOrigin?: string | null;
}): { subject: string; text: string; html: string } {
  const label = input.label.trim() || "your note";
  const webOrigin = resolveWebOrigin(input.webOrigin);
  const activityUrl = `${webOrigin}/account/activity`;
  const timeLabel = formatEventTimeUtc(input.eventAt);
  const country = input.country?.trim() || "";
  const deviceParts = [input.deviceClass?.trim(), input.browser?.trim()].filter(Boolean);
  const deviceLabel = deviceParts.length > 0 ? deviceParts.join(", ") : "";

  const eventLabel =
    input.event === "opened_destroyed"
      ? "opened and destroyed"
      : input.event === "attachment_downloaded"
        ? "attachment downloaded"
      : input.event === "receipt_acknowledged"
        ? "receipt confirmed"
        : input.event === "unopened_reminder"
          ? "still unopened"
          : input.event === "expired"
            ? "expired"
            : input.event;

  const subject =
    input.event === "attachment_downloaded"
      ? `PrivateNote: your file "${label}" was downloaded`
      : input.event === "receipt_acknowledged"
        ? `PrivateNote: receipt confirmed for "${label}"`
        : input.event === "unopened_reminder"
          ? `PrivateNote reminder: "${label}" is still unopened`
        : `PrivateNote: your note "${label}" was ${eventLabel}`;

  const title =
    input.event === "attachment_downloaded"
      ? "Attachment downloaded"
      : input.event === "receipt_acknowledged"
        ? "Receipt confirmed"
        : input.event === "unopened_reminder"
          ? "Note still unopened"
        : input.event === "opened_destroyed"
          ? "Note opened and destroyed"
          : input.event === "opened"
            ? "Note opened"
            : input.event === "destroyed"
              ? "Note destroyed"
              : input.event === "expired"
                ? "Note expired"
                : "Delivery update";

  const textIntro =
    input.event === "attachment_downloaded"
      ? `Your encrypted file "${label}" was downloaded.`
      : input.event === "receipt_acknowledged"
        ? `Receipt was confirmed for your secure note "${label}".`
        : input.event === "unopened_reminder"
          ? `Your secure note "${label}" has not been opened yet.`
        : `Your secure note "${label}" was ${eventLabel}.`;

  const explanatoryLine =
    input.event === "opened"
      ? "This is proof the link was accessed, not that the recipient read or understood the content."
      : input.event === "attachment_downloaded"
        ? "This confirms the encrypted attachment was requested for download. PrivateNote cannot see the decrypted file contents."
        : input.event === "receipt_acknowledged"
          ? "The recipient confirmed they successfully decrypted the note. This is stronger than an open receipt."
          : input.event === "unopened_reminder"
            ? "You can keep waiting or revoke the unopened link from Activity."
          : input.event === "expired"
            ? "This means the note can no longer be opened because its expiry time passed."
            : input.event === "opened_destroyed"
              ? "This means the link was accessed and the note can no longer be opened."
              : "This means the note can no longer be opened because its read limit was reached.";

  const privacyLine = "PrivateNote cannot see the decrypted message content.";
  const cta = "View in Activity";
  const preheader = `${title} · ${label}`;

  const text = [
    "PrivateNote.ai",
    "",
    title,
    "",
    textIntro,
    `Time: ${timeLabel}`,
    country ? `Approximate country: ${country}` : "",
    deviceLabel ? `Device: ${deviceLabel}` : "",
    "",
    explanatoryLine,
    "",
    privacyLine,
    "",
    `${cta}:`,
    activityUrl,
    "",
    "—",
    "PrivateNote.ai",
    LIFECYCLE_EMAIL_FOOTER,
    "www.privatenote.ai",
    "LinkedIn: https://www.linkedin.com/company/privatenote",
  ]
    .filter(Boolean)
    .join("\n");

  const detailRows = [
    detailRowHtml("Time", timeLabel),
    country ? detailRowHtml("Country", country) : "",
    deviceLabel ? detailRowHtml("Device", deviceLabel) : "",
    detailRowHtml("Note", label),
  ]
    .filter(Boolean)
    .join("");

  const logoHtml = buildNavbarLogoEmailHtml(webOrigin);
  const safeActivityUrl = escapeHtml(activityUrl);

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
    `              <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;font-weight:800;color:#050816;">${escapeHtml(title)}</h1>`,
    `              <p style="margin:0 0 18px;font-size:15px;line-height:1.5;font-weight:400;color:#374151;">${escapeHtml(textIntro)}</p>`,
    '              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 0 22px;">',
    "                <tr>",
    '                  <td style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:12px;padding:16px 18px;">',
    '                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">',
    detailRows,
    "                    </table>",
    "                  </td>",
    "                </tr>",
    "              </table>",
    `              <p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:#111827;">${escapeHtml(explanatoryLine)}</p>`,
    `              <p style="margin:0 0 24px;font-size:13px;line-height:1.45;color:#6b7280;">${escapeHtml(privacyLine)}</p>`,
    '              <p style="margin:0 0 10px;">',
    `                <a href="${safeActivityUrl}" style="display:inline-block;max-width:100%;box-sizing:border-box;background:#0000ff;color:#ffffff;text-decoration:none;padding:12px 30px;border-radius:8px;font-weight:600;font-size:15px;line-height:1.25;text-align:center;">${escapeHtml(cta)}</a>`,
    "              </p>",
    `              <p style="margin:0;font-size:12px;line-height:1.45;color:#6b7280;word-break:break-all;">${safeActivityUrl}</p>`,
    "            </td>",
    "          </tr>",
    "        </table>",
    "      </td>",
    "    </tr>",
    "    <tr>",
    `      <td align="center" bgcolor="#f3f4f6" style="background:#f3f4f6;padding:28px 16px 34px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#8a8f98;text-align:center;">`,
    '        <p style="margin:0 0 4px;font-size:13px;line-height:1.35;font-weight:700;color:#0000ff;">PrivateNote.ai</p>',
    '        <p style="margin:0 0 4px;font-size:13px;line-height:1.35;font-weight:600;color:#8a8f98;">Copyright &copy; PrivateNote.ai</p>',
    `        <p style="margin:0 0 16px;font-size:12px;line-height:1.35;color:#8a8f98;">${escapeHtml(LIFECYCLE_EMAIL_FOOTER)}</p>`,
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
