/**
 * Subscription plan catalog — single source for limits, pricing display, and feature flags.
 * Stripe billing maps configured Price IDs to these account types. Runtime
 * capabilities still come from the central subscription entitlement resolver.
 *
 * Principle: people pay for trust and workflow, not encryption or storage.
 * Launch: Free → Starter → Business. Teams is deferred.
 */

export type AccountType = "free" | "personal_premium" | "business_premium";
export type BillingCurrency = "usd" | "eur";
export type BillingInterval = "month" | "year";

export type PlanFeatureFlags = {
  hostedAiMonthly: number;
  attachmentMaxBytes: number;
  /** Max files/media items in one secure transfer (one created link). */
  attachmentsMaxCount: number;
  /** Max combined plaintext size of all items in one transfer. */
  attachmentTransferMaxBytes: number;
  /** Active encrypted payload still live (unread / not burned). */
  activePayloadBufferBytes: number;
  /**
   * Max file/photo/audio/recording transfers that may start per UTC day.
   * `null` means unlimited (paid plans).
   */
  maxAttachmentTransfersPerDay: number | null;
  /** Max attachment download window after reveal. */
  maxFileAccessWindowSeconds: number;
  /** Max note body size (UTF-8 bytes). */
  maxNotePlaintextUtf8Bytes: number;
  /** Longest exact note-expiry preset the plan may submit. */
  maxExpirySeconds: number;
  /** Exact note-open counts the plan may submit. */
  allowedReadCounts: readonly number[];
  /** Max voice-message recording length (MediaRecorder). */
  maxVoiceMessageSeconds: number;
  recipientLinkDelivery: boolean;
  readerLanguage: boolean;
  /** Starter+: pick a body typeface for the revealed note sheet. */
  revealBodyFont: boolean;
  /** Business: hide the normal download action on the recipient viewer. */
  attachmentViewOnly: boolean;
  /** Business: company profile / logo / accent on reveal. */
  revealBranding: boolean;
  proofOfAccess: boolean;
  recipientVerification: boolean;
  /** Starter+: note cannot be opened before a scheduled UTC time. */
  delayedReveal: boolean;
  /**
   * Starter+: recipient can confirm receipt after successful decrypt
   * (password unwrap when protected). Ack is stored on sent_notes.
   */
  receiptAcknowledgment: boolean;
  sentNotesDashboard: boolean;
  revokeUnopened: boolean;
  openNotifications: boolean;
  savedDefaults: boolean;
  /** Browser-saved custom AI prompt templates. */
  customPromptTemplates: boolean;
  premiumTemplatePacks: boolean;
  /**
   * Business: download / load / share device note labels (Notification Center)
   * as a portable file or PrivateNote — still never note content.
   */
  noteLabelPortability: boolean;
};

export type PlanDefinition = {
  id: AccountType;
  label: string;
  tagline: string;
  priceMonthlyUsd: number;
  priceYearlyUsd: number;
  priceMonthlyEur: number;
  priceYearlyEur: number;
  features: PlanFeatureFlags;
};

const MB = 1024 * 1024;
const GB = 1024 * MB;
const DAY = 24 * 60 * 60;

export const PLAN_CATALOG: Record<AccountType, PlanDefinition> = {
  free: {
    id: "free",
    label: "Free",
    tagline: "Send encrypted notes, passwords, and files without an account.",
    priceMonthlyUsd: 0,
    priceYearlyUsd: 0,
    priceMonthlyEur: 0,
    priceYearlyEur: 0,
    features: {
      hostedAiMonthly: 3,
      attachmentMaxBytes: 25 * MB,
      attachmentsMaxCount: 5,
      attachmentTransferMaxBytes: 25 * MB,
      activePayloadBufferBytes: 250 * MB,
      maxAttachmentTransfersPerDay: 10,
      maxFileAccessWindowSeconds: 60 * 60,
      maxNotePlaintextUtf8Bytes: 50 * 1024,
      maxExpirySeconds: 3 * DAY,
      allowedReadCounts: [1],
      maxVoiceMessageSeconds: 5 * 60,
      recipientLinkDelivery: false,
      readerLanguage: false,
      revealBodyFont: false,
      attachmentViewOnly: false,
      revealBranding: false,
      proofOfAccess: false,
      recipientVerification: false,
      delayedReveal: false,
      receiptAcknowledgment: false,
      sentNotesDashboard: false,
      revokeUnopened: false,
      openNotifications: true,
      savedDefaults: false,
      customPromptTemplates: false,
      premiumTemplatePacks: false,
      noteLabelPortability: false,
    },
  },
  personal_premium: {
    id: "personal_premium",
    label: "Starter",
    tagline: "Add recipient verification, proof of access, higher limits, and more control.",
    priceMonthlyUsd: 4,
    priceYearlyUsd: 40,
    priceMonthlyEur: 4,
    priceYearlyEur: 40,
    features: {
      hostedAiMonthly: 50,
      attachmentMaxBytes: 250 * MB,
      attachmentsMaxCount: 10,
      attachmentTransferMaxBytes: 250 * MB,
      activePayloadBufferBytes: 5 * GB,
      maxAttachmentTransfersPerDay: null,
      maxFileAccessWindowSeconds: 4 * 60 * 60,
      maxNotePlaintextUtf8Bytes: 200 * 1024,
      maxExpirySeconds: 15 * DAY,
      allowedReadCounts: [1, 2, 3],
      maxVoiceMessageSeconds: 15 * 60,
      recipientLinkDelivery: true,
      readerLanguage: true,
      revealBodyFont: true,
      attachmentViewOnly: false,
      revealBranding: false,
      proofOfAccess: true,
      recipientVerification: true,
      delayedReveal: true,
      receiptAcknowledgment: true,
      sentNotesDashboard: true,
      revokeUnopened: true,
      openNotifications: true,
      savedDefaults: true,
      customPromptTemplates: false,
      premiumTemplatePacks: true,
      noteLabelPortability: false,
    },
  },
  business_premium: {
    id: "business_premium",
    label: "Business",
    tagline: "Brand secure reveals for clients with your logo, colors, and business identity.",
    priceMonthlyUsd: 12,
    priceYearlyUsd: 120,
    priceMonthlyEur: 12,
    priceYearlyEur: 120,
    features: {
      hostedAiMonthly: 300,
      attachmentMaxBytes: 1 * GB,
      attachmentsMaxCount: 20,
      attachmentTransferMaxBytes: 1 * GB,
      activePayloadBufferBytes: 50 * GB,
      maxAttachmentTransfersPerDay: null,
      maxFileAccessWindowSeconds: 24 * 60 * 60,
      maxNotePlaintextUtf8Bytes: 500 * 1024,
      maxExpirySeconds: 30 * DAY,
      allowedReadCounts: [1, 2, 3, 5, 10],
      maxVoiceMessageSeconds: 30 * 60,
      recipientLinkDelivery: true,
      readerLanguage: true,
      revealBodyFont: true,
      attachmentViewOnly: true,
      revealBranding: true,
      proofOfAccess: true,
      recipientVerification: true,
      delayedReveal: true,
      receiptAcknowledgment: true,
      sentNotesDashboard: true,
      revokeUnopened: true,
      openNotifications: true,
      savedDefaults: true,
      customPromptTemplates: true,
      premiumTemplatePacks: true,
      noteLabelPortability: true,
    },
  },
};

export function normalizeAccountType(raw: string | null | undefined): AccountType {
  const value = (raw || "free").toLowerCase();
  if (value === "personal_premium" || value === "pro" || value === "premium" || value === "starter") {
    return "personal_premium";
  }
  if (
    value === "business_premium" ||
    value === "business" ||
    value === "premium_plus" ||
    value === "plus"
  ) {
    return "business_premium";
  }
  return "free";
}

export function planDefinitionFor(accountType: string | null | undefined): PlanDefinition {
  return PLAN_CATALOG[normalizeAccountType(accountType)];
}

export function planPriceFor(
  accountType: string | null | undefined,
  currency: BillingCurrency,
  interval: BillingInterval,
): number {
  const plan = planDefinitionFor(accountType);
  if (currency === "eur") {
    return interval === "month" ? plan.priceMonthlyEur : plan.priceYearlyEur;
  }
  return interval === "month" ? plan.priceMonthlyUsd : plan.priceYearlyUsd;
}

export function annualPlanSavingsPercent(
  accountType: string | null | undefined,
  currency: BillingCurrency,
): number {
  const monthly = planPriceFor(accountType, currency, "month");
  const yearly = planPriceFor(accountType, currency, "year");
  if (monthly <= 0 || yearly >= monthly * 12) return 0;
  return Math.round((1 - yearly / (monthly * 12)) * 100);
}

export function planFeaturesFor(
  accountType: string | null | undefined,
): PlanFeatureFlags {
  return planDefinitionFor(accountType).features;
}

export function hostedAiMonthlyLimit(accountType: string | null | undefined): number {
  return planDefinitionFor(accountType).features.hostedAiMonthly;
}

/** True for any paid plan (Starter or Business). */
export function hasPremiumFeatures(accountType: string | null | undefined): boolean {
  return normalizeAccountType(accountType) !== "free";
}

/** Opened/destroyed email alerts (available on free once signed in). */
export function hasOpenNotifications(accountType: string | null | undefined): boolean {
  return planDefinitionFor(accountType).features.openNotifications;
}

/** Revoke unopened tracked notes (Starter+). */
export function hasRevokeUnopened(accountType: string | null | undefined): boolean {
  return planDefinitionFor(accountType).features.revokeUnopened;
}

/** Coarse open receipt metadata for the sender (Starter+). */
export function hasProofOfAccess(accountType: string | null | undefined): boolean {
  return planDefinitionFor(accountType).features.proofOfAccess;
}
