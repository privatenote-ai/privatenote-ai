/** Keep in sync with STRIPE_CHANGEABLE_SUBSCRIPTION_STATUSES on the API. */
export const CANCELLABLE_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
  "unpaid",
  "paused",
  "grace",
]);

const PAID_ACCOUNT_TYPES = new Set(["personal_premium", "business_premium"]);

export type BillingPortalFlow = "manage" | "cancel";

export function canManageBilling(input: {
  stripeCustomerLinked?: boolean;
  accountType?: string | null;
}): boolean {
  if (input.stripeCustomerLinked === true) return true;
  return PAID_ACCOUNT_TYPES.has(input.accountType ?? "");
}

export function canCancelSubscription(input: {
  canManage: boolean;
  subscriptionState?: string | null;
  subscriptionStatus?: string | null;
  subscriptionLinked?: boolean;
  cancelAtPeriodEnd?: boolean;
}): boolean {
  if (!input.canManage || input.cancelAtPeriodEnd === true) return false;
  if (input.subscriptionState === "manual") return false;
  if (input.subscriptionLinked === false) return false;
  const status = (input.subscriptionStatus ?? input.subscriptionState ?? "")
    .trim()
    .toLowerCase();
  if (!status) return true;
  if (status === "free" || status === "expired" || status === "invalid") return false;
  return CANCELLABLE_SUBSCRIPTION_STATUSES.has(status);
}
