import {
  resolveAccountEntitlements,
  type AccountEntitlementInput,
  type ResolvedAccountEntitlements,
} from "@shared/accountEntitlements";
import type { Env } from "./types";

type AccountEntitlementRow = {
  account_type: string | null;
  plan: string | null;
  subscription_status?: string | null;
  subscription_current_period_end?: string | null;
  subscription_grace_period_end?: string | null;
  manual_entitlement_expires_at?: string | null;
  manual_entitlement_account_type?: string | null;
};

export function resolveAccountEntitlementsFromRow(
  row: AccountEntitlementRow | null | undefined,
  now = new Date(),
): ResolvedAccountEntitlements {
  const input: AccountEntitlementInput = {
    accountType: row?.account_type,
    plan: row?.plan,
    subscriptionStatus: row?.subscription_status,
    subscriptionCurrentPeriodEnd: row?.subscription_current_period_end,
    subscriptionGracePeriodEnd: row?.subscription_grace_period_end,
    manualEntitlementExpiresAt: row?.manual_entitlement_expires_at,
    manualEntitlementAccountType: row?.manual_entitlement_account_type,
  };
  return resolveAccountEntitlements(input, now);
}

/**
 * Loads the authoritative effective plan for one user. Deployments that have
 * not applied the subscription migration fail closed to Free for paid rows.
 */
export async function getAccountEntitlements(
  env: Env,
  userId: string,
  now = new Date(),
): Promise<ResolvedAccountEntitlements> {
  if (!env.AUTH_DB) return resolveAccountEntitlements({}, now);
  let row: AccountEntitlementRow | null = null;
  try {
    row = await env.AUTH_DB.prepare(
      `SELECT
         account_type,
         plan,
         subscription_status,
         subscription_current_period_end,
         subscription_grace_period_end,
         manual_entitlement_expires_at,
         manual_entitlement_account_type
       FROM users
       WHERE id = ?
       LIMIT 1`,
    )
      .bind(userId)
      .first<AccountEntitlementRow>();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/no such column/i.test(message)) throw error;
    row = await env.AUTH_DB.prepare(
      "SELECT account_type, plan FROM users WHERE id = ? LIMIT 1",
    )
      .bind(userId)
      .first<AccountEntitlementRow>();
  }
  return resolveAccountEntitlementsFromRow(row, now);
}
