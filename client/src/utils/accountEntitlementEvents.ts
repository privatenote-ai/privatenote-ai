export const ACCOUNT_ENTITLEMENTS_INVALIDATED_EVENT =
  "privatenote-account-entitlements-invalidated";

const ENTITLEMENT_ERROR_CODES = new Set([
  "premium_required",
  "business_plan_required",
  "notifications_not_available",
]);

export function isEntitlementRejectionResponse(
  status: number,
  bodyText: string,
): boolean {
  if (status !== 403) return false;
  try {
    const body = JSON.parse(bodyText) as { error?: unknown };
    return (
      typeof body.error === "string" &&
      ENTITLEMENT_ERROR_CODES.has(body.error)
    );
  } catch {
    return false;
  }
}

export function notifyAccountEntitlementsInvalidated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ACCOUNT_ENTITLEMENTS_INVALIDATED_EVENT));
}
