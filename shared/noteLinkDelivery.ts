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
    ? `${sender} shared a private note with you`
    : "Someone shared a private note with you";

  const textLines = [
    subject + ".",
    "",
    "Open this one-time link to view it (do not forward the email):",
    input.noteUrl,
    "",
    "The note may expire or become unavailable after it is opened.",
    "PrivateNote never includes the note contents in this email.",
    "",
    "— PrivateNote",
  ];

  const safeUrl = escapeHtml(input.noteUrl);
  const intro = sender
    ? `${escapeHtml(sender)} shared a private note with you.`
    : "Someone shared a private note with you.";

  const html = [
    '<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px 16px; color: #111827;">',
    `  <p style="margin: 0 0 12px; font-size: 16px; line-height: 1.45;">${intro}</p>`,
    `  <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.45; color: #374151;">Open this one-time link to view it. Do not forward this email.</p>`,
    `  <a href="${safeUrl}" referrerpolicy="no-referrer" style="display: inline-block; background: #0066FF; color: #FFFFFF; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 600; font-size: 15px;">Open private note</a>`,
    `  <p style="margin: 18px 0 0; font-size: 12px; line-height: 1.5; color: #6B7280; word-break: break-all;">${safeUrl}</p>`,
    `  <p style="margin: 16px 0 0; font-size: 12px; line-height: 1.5; color: #6B7280;">The note may expire or become unavailable after it is opened. PrivateNote never includes the note contents in this email.</p>`,
    `  <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 20px 0 14px;" />`,
    `  <p style="margin: 0; font-size: 13px; font-weight: 700;">PrivateNote</p>`,
    "</div>",
  ].join("");

  return { subject, text: textLines.join("\n"), html };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
