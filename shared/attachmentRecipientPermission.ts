/**
 * Recipient handling policy for an attached file.
 *
 * Snapshotted onto the note at create time (reveal is anonymous). This is a
 * handling policy, not DRM: view-only hides the normal download action and
 * states the sender's intent. It cannot stop screenshots or other capture.
 */

export const ATTACHMENT_RECIPIENT_PERMISSIONS = ["download", "view-only"] as const;

export type AttachmentRecipientPermission = (typeof ATTACHMENT_RECIPIENT_PERMISSIONS)[number];

/** Stored on the note only when the sender chose view-only. Download is the default. */
export type StoredAttachmentRecipientPermission = Extract<
  AttachmentRecipientPermission,
  "view-only"
>;

export function isAttachmentRecipientPermission(
  value: unknown,
): value is AttachmentRecipientPermission {
  return value === "download" || value === "view-only";
}

/**
 * Parses a wire value. `"download"`, null, and unknown tokens become `undefined`
 * so callers can omit the field rather than persist a default.
 */
export function parseAttachmentRecipientPermission(
  raw: unknown,
): StoredAttachmentRecipientPermission | undefined {
  if (raw == null) return undefined;
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "download") return undefined;
  if (trimmed === "view-only") return trimmed;
  return undefined;
}
