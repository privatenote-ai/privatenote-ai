import {
  normalizeAccountType,
  planFeaturesFor,
  type AccountType,
  type PlanFeatureFlags,
} from "./planCatalog";

export type AccountEntitlementInput = {
  accountType?: string | null;
  plan?: string | null;
  subscriptionStatus?: string | null;
  subscriptionCurrentPeriodEnd?: string | null;
  subscriptionGracePeriodEnd?: string | null;
  manualEntitlementExpiresAt?: string | null;
  manualEntitlementAccountType?: string | null;
};

export type AccountEntitlementState =
  | "free"
  | "active"
  | "trialing"
  | "grace"
  | "manual"
  | "expired"
  | "invalid";

export type ResolvedAccountEntitlements = {
  configuredAccountType: AccountType;
  accountType: AccountType;
  capabilities: PlanFeatureFlags;
  state: AccountEntitlementState;
  paidAccessExpiresAt: string | null;
};

function validFutureInstant(value: string | null | undefined, nowMs: number): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.getTime() <= nowMs) return null;
  return parsed;
}

/**
 * Paid access fails closed: account_type alone is never sufficient.
 * Active/trialing subscriptions require a future period end. A future,
 * explicitly stored grace end temporarily preserves paid capabilities.
 */
export function resolveAccountEntitlements(
  input: AccountEntitlementInput,
  now = new Date(),
): ResolvedAccountEntitlements {
  const accountTypeValue = normalizeAccountType(input.accountType);
  const legacyPlanValue = normalizeAccountType(input.plan);
  const configuredAccountType =
    accountTypeValue !== "free" ? accountTypeValue : legacyPlanValue;

  const nowMs = now.getTime();
  const status = input.subscriptionStatus?.trim().toLowerCase() ?? "";
  const currentPeriodEnd = validFutureInstant(
    input.subscriptionCurrentPeriodEnd,
    nowMs,
  );
  const gracePeriodEnd = validFutureInstant(input.subscriptionGracePeriodEnd, nowMs);
  const manualEntitlementEnd = validFutureInstant(
    input.manualEntitlementExpiresAt,
    nowMs,
  );
  const manualAccountType = normalizeAccountType(input.manualEntitlementAccountType);

  if (manualEntitlementEnd) {
    const effectiveManualType =
      manualAccountType !== "free" ? manualAccountType : configuredAccountType;
    if (effectiveManualType !== "free") {
      return {
        configuredAccountType,
        accountType: effectiveManualType,
        capabilities: planFeaturesFor(effectiveManualType),
        state: "manual",
        paidAccessExpiresAt: manualEntitlementEnd.toISOString(),
      };
    }
  }

  if (configuredAccountType === "free") {
    return {
      configuredAccountType,
      accountType: "free",
      capabilities: planFeaturesFor("free"),
      state: "free",
      paidAccessExpiresAt: null,
    };
  }

  if ((status === "active" || status === "trialing") && currentPeriodEnd) {
    return {
      configuredAccountType,
      accountType: configuredAccountType,
      capabilities: planFeaturesFor(configuredAccountType),
      state: status,
      paidAccessExpiresAt: currentPeriodEnd.toISOString(),
    };
  }

  if (gracePeriodEnd) {
    return {
      configuredAccountType,
      accountType: configuredAccountType,
      capabilities: planFeaturesFor(configuredAccountType),
      state: "grace",
      paidAccessExpiresAt: gracePeriodEnd.toISOString(),
    };
  }

  return {
    configuredAccountType,
    accountType: "free",
    capabilities: planFeaturesFor("free"),
    state: status && input.subscriptionCurrentPeriodEnd ? "expired" : "invalid",
    paidAccessExpiresAt: null,
  };
}
