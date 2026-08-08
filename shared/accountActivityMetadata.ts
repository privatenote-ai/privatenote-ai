/**
 * Privacy-safe create options stored on account_activity rows.
 * Never includes note content, keys, recipient emails, or labels.
 */
export type AccountActivityCreateMetadata = {
  hasAttachment?: boolean;
  passwordProtected?: boolean;
  maxReads?: number;
  expirySeconds?: number;
  notifyOnOpen?: boolean;
  notifyOnDestroyed?: boolean;
  notifyOnAttachmentDownload?: boolean;
  requireRecipientVerification?: boolean;
  requireReceiptAck?: boolean;
  aiEnhanced?: boolean;
  aiMode?: "local" | "cloud" | null;
};

export function serializeAccountActivityMetadata(
  metadata: AccountActivityCreateMetadata | null | undefined,
): string | null {
  if (!metadata || typeof metadata !== "object") return null;
  const compact: AccountActivityCreateMetadata = {};
  if (metadata.hasAttachment === true) compact.hasAttachment = true;
  if (metadata.passwordProtected === true) compact.passwordProtected = true;
  if (typeof metadata.maxReads === "number" && Number.isFinite(metadata.maxReads) && metadata.maxReads > 0) {
    compact.maxReads = Math.floor(metadata.maxReads);
  }
  if (
    typeof metadata.expirySeconds === "number" &&
    Number.isFinite(metadata.expirySeconds) &&
    metadata.expirySeconds > 0
  ) {
    compact.expirySeconds = Math.floor(metadata.expirySeconds);
  }
  if (metadata.notifyOnOpen === true) compact.notifyOnOpen = true;
  if (metadata.notifyOnDestroyed === true) compact.notifyOnDestroyed = true;
  if (metadata.notifyOnAttachmentDownload === true) compact.notifyOnAttachmentDownload = true;
  if (metadata.requireRecipientVerification === true) compact.requireRecipientVerification = true;
  if (metadata.requireReceiptAck === true) compact.requireReceiptAck = true;
  if (metadata.aiEnhanced === true) compact.aiEnhanced = true;
  if (metadata.aiMode === "local" || metadata.aiMode === "cloud") compact.aiMode = metadata.aiMode;

  return Object.keys(compact).length > 0 ? JSON.stringify(compact) : null;
}

export function parseAccountActivityMetadata(
  raw: unknown,
): AccountActivityCreateMetadata | null {
  if (raw == null) return null;
  let value: unknown = raw;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    try {
      value = JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const serialized = serializeAccountActivityMetadata({
    hasAttachment: input.hasAttachment === true,
    passwordProtected: input.passwordProtected === true,
    maxReads: typeof input.maxReads === "number" ? input.maxReads : undefined,
    expirySeconds: typeof input.expirySeconds === "number" ? input.expirySeconds : undefined,
    notifyOnOpen: input.notifyOnOpen === true,
    notifyOnDestroyed: input.notifyOnDestroyed === true,
    notifyOnAttachmentDownload: input.notifyOnAttachmentDownload === true,
    requireRecipientVerification: input.requireRecipientVerification === true,
    requireReceiptAck: input.requireReceiptAck === true,
    aiEnhanced: input.aiEnhanced === true,
    aiMode: input.aiMode === "local" || input.aiMode === "cloud" ? input.aiMode : null,
  });
  if (!serialized) return null;
  return JSON.parse(serialized) as AccountActivityCreateMetadata;
}
