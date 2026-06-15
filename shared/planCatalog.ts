/**
 * Subscription plan catalog — single source for limits, pricing display, and feature flags.
 * Stripe entitlements are applied server-side from verified webhook events.
 */

export type AccountType = "free" | "personal_premium" | "business_premium";

export type PlanFeatureFlags = {
  hostedAiMonthly: number;
  proofOfAccess: boolean;
  recipientVerification: boolean;
  sentNotesDashboard: boolean;
  revokeUnopened: boolean;
  openNotifications: boolean;
  savedDefaults: boolean;
  customTemplates: boolean;
  premiumTemplatePacks: boolean;
};

export type PlanDefinition = {
  id: AccountType;
  label: string;
  tagline: string;
  priceMonthlyUsd: number;
  priceYearlyUsd: number;
  features: PlanFeatureFlags;
};

export const PLAN_CATALOG: Record<AccountType, PlanDefinition> = {
  free: {
    id: "free",
    label: "Free",
    tagline: "Encrypted one-time notes with optional on-device AI.",
    priceMonthlyUsd: 0,
    priceYearlyUsd: 0,
    features: {
      hostedAiMonthly: 3,
      proofOfAccess: false,
      recipientVerification: false,
      sentNotesDashboard: false,
      revokeUnopened: false,
      openNotifications: false,
      savedDefaults: false,
      customTemplates: false,
      premiumTemplatePacks: false,
    },
  },
  personal_premium: {
    id: "personal_premium",
    label: "Premium Individual",
    tagline: "Proof of access, recipient checks, and more hosted AI.",
    priceMonthlyUsd: 3,
    priceYearlyUsd: 24,
    features: {
      hostedAiMonthly: 100,
      proofOfAccess: true,
      recipientVerification: true,
      sentNotesDashboard: true,
      revokeUnopened: true,
      openNotifications: true,
      savedDefaults: true,
      customTemplates: true,
      premiumTemplatePacks: true,
    },
  },
  business_premium: {
    id: "business_premium",
    label: "Premium Plus",
    tagline: "Higher hosted AI limits for power users and teams (future).",
    priceMonthlyUsd: 5,
    priceYearlyUsd: 48,
    features: {
      hostedAiMonthly: 500,
      proofOfAccess: true,
      recipientVerification: true,
      sentNotesDashboard: true,
      revokeUnopened: true,
      openNotifications: true,
      savedDefaults: true,
      customTemplates: true,
      premiumTemplatePacks: true,
    },
  },
};

export function normalizeAccountType(raw: string | null | undefined): AccountType {
  const value = (raw || "free").toLowerCase();
  if (value === "personal_premium" || value === "pro") return "personal_premium";
  if (value === "business_premium" || value === "business") return "business_premium";
  return "free";
}

export function planDefinitionFor(accountType: string | null | undefined): PlanDefinition {
  return PLAN_CATALOG[normalizeAccountType(accountType)];
}

export function hostedAiMonthlyLimit(accountType: string | null | undefined): number {
  return planDefinitionFor(accountType).features.hostedAiMonthly;
}

export function hasPremiumFeatures(accountType: string | null | undefined): boolean {
  const t = normalizeAccountType(accountType);
  return t === "personal_premium" || t === "business_premium";
}
