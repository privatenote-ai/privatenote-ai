import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  D1Database,
  D1PreparedStatement,
} from "@cloudflare/workers-types";
import { resolveAccountEntitlements } from "@shared/accountEntitlements";
import {
  processStripeWebhookEvent,
  reconcileStripeSubscriptions,
  type StripeEvent,
  type StripeSubscription,
} from "./stripeBilling";
import type { Env } from "./types";

const NOW_SECONDS = 1_800_000_000;
const DAY = 24 * 60 * 60;
const PRICES = {
  personalMonth: "price_personal_month",
  personalYear: "price_personal_year",
  businessMonth: "price_business_month",
  businessYear: "price_business_year",
};

type BillingUser = {
  id: string;
  account_type: string;
  plan: string;
  subscription_status: string | null;
  subscription_current_period_end: string | null;
  subscription_grace_period_end: string | null;
  manual_entitlement_expires_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  subscription_cancel_at_period_end: number;
  subscription_last_event_created: number | null;
  subscription_last_reconciled_at: string | null;
  subscription_reconciliation_error: string | null;
};

type ReconciliationRun = {
  id: string;
  status: string;
  scanned: number;
  repaired: number;
  unchanged: number;
  failed: number;
  error: string | null;
};

class BillingMemoryDb {
  readonly webhookEvents = new Set<string>();
  readonly reconciliationRuns = new Map<string, ReconciliationRun>();
  readonly reconciliationFailures: Array<{
    runId: string;
    userId: string;
    subscriptionId: string;
    code: string;
    message: string;
  }> = [];

  constructor(readonly users: BillingUser[]) {}

  private findUser(sql: string, value: unknown): BillingUser | null {
    if (sql.includes("stripe_subscription_id = ?")) {
      return this.users.find((user) => user.stripe_subscription_id === value) ?? null;
    }
    if (sql.includes("stripe_customer_id = ?")) {
      return this.users.find((user) => user.stripe_customer_id === value) ?? null;
    }
    return this.users.find((user) => user.id === value) ?? null;
  }

  private applySubscriptionUpdate(
    sql: string,
    bindings: unknown[],
  ): void {
    const authoritative = !sql.includes("subscription_last_event_created = ?");
    const userId = String(bindings[authoritative ? 9 : 10]);
    const user = this.users.find((candidate) => candidate.id === userId);
    if (!user) return;
    if (!authoritative) {
      const eventCreated = Number(bindings[9]);
      if (
        user.subscription_last_event_created !== null &&
        user.subscription_last_event_created > eventCreated
      ) {
        return;
      }
      user.subscription_last_event_created = eventCreated;
    }
    user.account_type = String(bindings[0]);
    user.plan = String(bindings[1]);
    user.subscription_status = bindings[2] as string;
    user.subscription_current_period_end = bindings[3] as string | null;
    user.subscription_grace_period_end = bindings[4] as string | null;
    user.manual_entitlement_expires_at = null;
    if (bindings[5]) user.stripe_customer_id = String(bindings[5]);
    user.stripe_subscription_id =
      bindings[6] == null ? null : String(bindings[6]);
    user.stripe_price_id = bindings[7] as string | null;
    user.subscription_cancel_at_period_end = Number(bindings[8]);
  }

  asD1(): D1Database {
    const memory = this;
    return {
      prepare(sql: string) {
        let bindings: unknown[] = [];
        const statement = {
          bind(...values: unknown[]) {
            bindings = values;
            return statement;
          },
          async first() {
            if (sql.includes("FROM billing_reconciliation_state")) {
              return null;
            }
            if (sql.includes("FROM billing_webhook_events")) {
              return memory.webhookEvents.has(String(bindings[0]))
                ? { event_id: bindings[0], processing_status: "processed" }
                : null;
            }
            if (sql.includes("FROM users WHERE")) {
              return memory.findUser(sql, bindings[0]);
            }
            return null;
          },
          async all() {
            if (sql.includes("FROM users") && sql.includes("subscription_last_reconciled_at")) {
              const limit = Number(bindings[0]);
              const results = memory.users
                .filter((user) => Boolean(user.stripe_subscription_id))
                .sort((left, right) => {
                  if (left.subscription_last_reconciled_at === null) return -1;
                  if (right.subscription_last_reconciled_at === null) return 1;
                  return left.subscription_last_reconciled_at.localeCompare(
                    right.subscription_last_reconciled_at,
                  );
                })
                .slice(0, limit);
              return { success: true, results, meta: {} };
            }
            return { success: true, results: [], meta: {} };
          },
          async run() {
            let changes = 1;
            if (
              sql.includes("UPDATE users") &&
              sql.includes("subscription_status = ?")
            ) {
              memory.applySubscriptionUpdate(sql, bindings);
            } else if (
              sql.includes("UPDATE users") &&
              sql.includes("subscription_last_reconciled_at = ?")
            ) {
              const user = memory.users.find(
                (candidate) =>
                  candidate.id === String(bindings[bindings.length - 1]),
              );
              if (user) {
                user.subscription_last_reconciled_at = String(bindings[0]);
                user.subscription_reconciliation_error =
                  sql.includes("subscription_reconciliation_error = NULL")
                    ? null
                    : String(bindings[1]);
              }
            } else if (sql.includes("INSERT OR IGNORE INTO billing_webhook_events")) {
              const eventId = String(bindings[0]);
              if (memory.webhookEvents.has(eventId)) {
                changes = 0;
              } else {
                memory.webhookEvents.add(eventId);
              }
            } else if (
              sql.includes("UPDATE billing_webhook_events") &&
              sql.includes("processing_status = 'failed'")
            ) {
              changes = 0;
            } else if (sql.includes("INSERT INTO billing_reconciliation_runs")) {
              memory.reconciliationRuns.set(String(bindings[0]), {
                id: String(bindings[0]),
                status: "running",
                scanned: 0,
                repaired: 0,
                unchanged: 0,
                failed: 0,
                error: null,
              });
            } else if (sql.includes("INSERT INTO billing_reconciliation_failures")) {
              memory.reconciliationFailures.push({
                runId: String(bindings[1]),
                userId: String(bindings[2]),
                subscriptionId: String(bindings[3]),
                code: String(bindings[4]),
                message: String(bindings[5]),
              });
            } else if (sql.includes("UPDATE billing_reconciliation_runs")) {
              const run = memory.reconciliationRuns.get(
                String(bindings[bindings.length - 1]),
              );
              if (run) {
                const failedRun = sql.includes("status = 'failed'");
                run.status = failedRun ? "failed" : String(bindings[1]);
                run.scanned = Number(bindings[failedRun ? 1 : 2]);
                run.repaired = Number(bindings[failedRun ? 2 : 3]);
                run.unchanged = Number(bindings[failedRun ? 3 : 4]);
                run.failed = Number(bindings[failedRun ? 4 : 5]);
                run.error = failedRun ? String(bindings[5]) : null;
              }
            }
            return { success: true, meta: { changes }, results: [] };
          },
          async raw() {
            return [];
          },
        };
        return statement as unknown as D1PreparedStatement;
      },
      async batch() {
        return [];
      },
      async exec() {
        return { count: 0, duration: 0 };
      },
      withSession() {
        throw new Error("not used");
      },
      async dump() {
        return new ArrayBuffer(0);
      },
    } as unknown as D1Database;
  }
}

function freeUser(overrides: Partial<BillingUser> = {}): BillingUser {
  return {
    id: "user-1",
    account_type: "free",
    plan: "free",
    subscription_status: null,
    subscription_current_period_end: null,
    subscription_grace_period_end: null,
    manual_entitlement_expires_at: null,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    stripe_price_id: null,
    subscription_cancel_at_period_end: 0,
    subscription_last_event_created: null,
    subscription_last_reconciled_at: null,
    subscription_reconciliation_error: null,
    ...overrides,
  };
}

function envFor(memory: BillingMemoryDb): Env {
  return {
    AUTH_DB: memory.asD1(),
    STRIPE_SECRET_KEY: "sk_test_lifecycle",
    STRIPE_WEBHOOK_SECRET: "whsec_lifecycle",
    STRIPE_GRACE_PERIOD_DAYS: "3",
    STRIPE_RECONCILIATION_LIMIT: "100",
    STRIPE_PRICE_PERSONAL_MONTHLY: PRICES.personalMonth,
    STRIPE_PRICE_PERSONAL_YEARLY: PRICES.personalYear,
    STRIPE_PRICE_BUSINESS_MONTHLY: PRICES.businessMonth,
    STRIPE_PRICE_BUSINESS_YEARLY: PRICES.businessYear,
  } as unknown as Env;
}

function subscription(input: {
  id?: string;
  status?: string;
  price?: string;
  periodEnd?: number;
  cancelAtPeriodEnd?: boolean;
} = {}): StripeSubscription {
  return {
    id: input.id ?? "sub_1",
    customer: "cus_1",
    status: input.status ?? "active",
    cancel_at_period_end: input.cancelAtPeriodEnd ?? false,
    metadata: { privatenote_user_id: "user-1" },
    items: {
      data: [{
        current_period_end: input.periodEnd ?? NOW_SECONDS + 30 * DAY,
        price: { id: input.price ?? PRICES.personalMonth },
      }],
    },
  };
}

function event(
  id: string,
  type: string,
  object: Record<string, unknown>,
  created = NOW_SECONDS,
): StripeEvent {
  return { id, type, created, data: { object } };
}

function stripeFetch(
  subscriptions: Map<string, StripeSubscription>,
  failingIds = new Set<string>(),
  listedSubscriptions: StripeSubscription[] = [],
  requestedUrls: string[] = [],
): typeof fetch {
  return async (input) => {
    const url = new URL(String(input));
    requestedUrls.push(url.toString());
    if (url.pathname === "/v1/subscriptions") {
      return Response.json({ data: listedSubscriptions, has_more: false });
    }
    const id = decodeURIComponent(url.pathname.split("/").pop() ?? "");
    if (failingIds.has(id)) {
      return Response.json(
        { error: { code: "api_connection_error", message: "Stripe unavailable" } },
        { status: 500 },
      );
    }
    const value = subscriptions.get(id);
    if (!value) {
      return Response.json(
        { error: { code: "resource_missing", message: "Subscription missing" } },
        { status: 404 },
      );
    }
    return Response.json(value);
  };
}

function entitlements(user: BillingUser, atSeconds = NOW_SECONDS) {
  return resolveAccountEntitlements(
    {
      accountType: user.account_type,
      plan: user.plan,
      subscriptionStatus: user.subscription_status,
      subscriptionCurrentPeriodEnd: user.subscription_current_period_end,
      subscriptionGracePeriodEnd: user.subscription_grace_period_end,
      manualEntitlementExpiresAt: user.manual_entitlement_expires_at,
    },
    new Date(atSeconds * 1000),
  );
}

describe("Stripe billing lifecycle integration", () => {
  it("activates a successful checkout and supports resubscription after expiry", async () => {
    const user = freeUser();
    const memory = new BillingMemoryDb([user]);
    const env = envFor(memory);
    const subscriptions = new Map([
      ["sub_1", subscription()],
      ["sub_2", subscription({ id: "sub_2", price: PRICES.businessYear })],
    ]);

    await processStripeWebhookEvent(
      env,
      event("evt_checkout_1", "checkout.session.completed", {
        subscription: "sub_1",
        client_reference_id: user.id,
      }),
      stripeFetch(subscriptions),
    );
    assert.equal(entitlements(user).accountType, "personal_premium");

    await processStripeWebhookEvent(
      env,
      event(
        "evt_cancel_1",
        "customer.subscription.deleted",
        subscription({ status: "canceled", periodEnd: NOW_SECONDS }),
        NOW_SECONDS + 1,
      ),
    );
    assert.equal(entitlements(user, NOW_SECONDS + 2).accountType, "free");
    assert.equal(user.stripe_subscription_id, null);
    assert.equal(user.stripe_customer_id, "cus_1");

    await processStripeWebhookEvent(
      env,
      event(
        "evt_checkout_2",
        "checkout.session.completed",
        { subscription: "sub_2", client_reference_id: user.id },
        NOW_SECONDS + 2,
      ),
      stripeFetch(subscriptions),
    );
    assert.equal(user.stripe_subscription_id, "sub_2");
    assert.equal(entitlements(user, NOW_SECONDS + 3).accountType, "business_premium");
  });

  it("expires trials and immediately canceled subscriptions", async () => {
    const user = freeUser();
    const memory = new BillingMemoryDb([user]);
    const env = envFor(memory);

    await processStripeWebhookEvent(
      env,
      event(
        "evt_trial",
        "customer.subscription.created",
        subscription({ status: "trialing", periodEnd: NOW_SECONDS + DAY }),
      ),
    );
    assert.equal(entitlements(user).state, "trialing");
    assert.equal(entitlements(user, NOW_SECONDS + DAY + 1).accountType, "free");

    await processStripeWebhookEvent(
      env,
      event(
        "evt_immediate_cancel",
        "customer.subscription.deleted",
        subscription({ status: "canceled", periodEnd: NOW_SECONDS + DAY }),
        NOW_SECONDS + 1,
      ),
    );
    assert.equal(entitlements(user, NOW_SECONDS + 2).accountType, "free");
  });

  it("renews after payment and clears a previous payment-failure grace period", async () => {
    const user = freeUser({
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_1",
      account_type: "personal_premium",
      plan: "personal_premium",
    });
    const memory = new BillingMemoryDb([user]);
    const env = envFor(memory);
    const failed = subscription({
      status: "past_due",
      periodEnd: NOW_SECONDS - DAY,
    });
    await processStripeWebhookEvent(
      env,
      event("evt_failed", "invoice.payment_failed", { subscription: "sub_1" }),
      stripeFetch(new Map([["sub_1", failed]])),
    );
    assert.equal(entitlements(user, NOW_SECONDS + DAY).state, "grace");
    assert.equal(entitlements(user, NOW_SECONDS + 3 * DAY + 1).accountType, "free");

    const renewed = subscription({ periodEnd: NOW_SECONDS + 31 * DAY });
    await processStripeWebhookEvent(
      env,
      event(
        "evt_paid",
        "invoice.paid",
        { subscription: "sub_1" },
        NOW_SECONDS + DAY,
      ),
      stripeFetch(new Map([["sub_1", renewed]])),
    );
    assert.equal(user.subscription_grace_period_end, null);
    assert.equal(entitlements(user, NOW_SECONDS + DAY).state, "active");
  });

  it("keeps scheduled cancellations active only until their paid period ends", async () => {
    const user = freeUser();
    const memory = new BillingMemoryDb([user]);
    await processStripeWebhookEvent(
      envFor(memory),
      event(
        "evt_scheduled_cancel",
        "customer.subscription.updated",
        subscription({
          cancelAtPeriodEnd: true,
          periodEnd: NOW_SECONDS + 7 * DAY,
        }),
      ),
    );
    assert.equal(user.subscription_cancel_at_period_end, 1);
    assert.equal(entitlements(user, NOW_SECONDS + DAY).accountType, "personal_premium");
    assert.equal(entitlements(user, NOW_SECONDS + 7 * DAY + 1).accountType, "free");
  });

  it("applies upgrades and downgrades between Individual and Business", async () => {
    const user = freeUser();
    const memory = new BillingMemoryDb([user]);
    const env = envFor(memory);
    await processStripeWebhookEvent(
      env,
      event(
        "evt_business",
        "customer.subscription.created",
        subscription({ price: PRICES.businessMonth }),
      ),
    );
    assert.equal(entitlements(user).capabilities.revealBranding, true);

    await processStripeWebhookEvent(
      env,
      event(
        "evt_personal",
        "customer.subscription.updated",
        subscription({ price: PRICES.personalYear }),
        NOW_SECONDS + 1,
      ),
    );
    assert.equal(entitlements(user).accountType, "personal_premium");
    assert.equal(entitlements(user).capabilities.revealBranding, false);
  });

  it("ignores duplicate and out-of-order webhook mutations", async () => {
    const user = freeUser();
    const memory = new BillingMemoryDb([user]);
    const env = envFor(memory);
    const newer = event(
      "evt_newer",
      "customer.subscription.updated",
      subscription({ price: PRICES.businessMonth }),
      NOW_SECONDS + 10,
    );
    await processStripeWebhookEvent(env, newer);
    const duplicate = await processStripeWebhookEvent(env, newer);
    await processStripeWebhookEvent(
      env,
      event(
        "evt_older",
        "customer.subscription.updated",
        subscription({ price: PRICES.personalMonth }),
        NOW_SECONDS + 5,
      ),
    );
    assert.equal(duplicate.duplicate, true);
    assert.equal(entitlements(user).accountType, "business_premium");
    assert.equal(user.subscription_last_event_created, NOW_SECONDS + 10);
  });
});

describe("Stripe reconciliation integration", () => {
  it("discovers a paid subscription when all account-linking webhooks were missed", async () => {
    const user = freeUser();
    const memory = new BillingMemoryDb([user]);
    const orphan = subscription({ id: "sub_orphan" });
    const result = await reconcileStripeSubscriptions(envFor(memory), {
      now: new Date(NOW_SECONDS * 1000),
      runId: "reconcile-orphan",
      fetchImpl: stripeFetch(new Map(), new Set(), [orphan]),
    });

    assert.equal(result.status, "completed");
    assert.equal(result.scanned, 1);
    assert.equal(result.repaired, 1);
    assert.equal(user.stripe_subscription_id, "sub_orphan");
    assert.equal(entitlements(user).accountType, "personal_premium");
  });

  it("still reserves orphan discovery when the reconciliation limit is one", async () => {
    const linked = freeUser({
      id: "user-linked",
      stripe_customer_id: "cus_linked",
      stripe_subscription_id: "sub_linked",
      subscription_status: "active",
    });
    const orphanOwner = freeUser({ id: "user-orphan" });
    const memory = new BillingMemoryDb([linked, orphanOwner]);
    const linkedRemote = subscription({ id: "sub_linked" });
    linkedRemote.customer = "cus_linked";
    linkedRemote.metadata = { privatenote_user_id: linked.id };
    const orphan = subscription({ id: "sub_orphan" });
    orphan.metadata = { privatenote_user_id: orphanOwner.id };
    const urls: string[] = [];
    const env = {
      ...envFor(memory),
      STRIPE_RECONCILIATION_LIMIT: "1",
    };
    await reconcileStripeSubscriptions(env, {
      now: new Date(NOW_SECONDS * 1000),
      runId: "reconcile-small-budget",
      fetchImpl: stripeFetch(
        new Map([["sub_linked", linkedRemote]]),
        new Set(),
        [orphan],
        urls,
      ),
    });

    assert.equal(orphanOwner.stripe_subscription_id, "sub_orphan");
    const discoveryUrl = urls.find((value) =>
      new URL(value).pathname === "/v1/subscriptions"
    );
    assert.ok(discoveryUrl);
    assert.equal(new URL(discoveryUrl).searchParams.get("status"), "active");
    assert.equal(new URL(discoveryUrl).searchParams.get("limit"), "1");
  });

  it("counts terminal subscription unlinking as a reconciliation repair", async () => {
    const user = freeUser({
      account_type: "personal_premium",
      plan: "personal_premium",
      subscription_status: "canceled",
      subscription_current_period_end: new Date(NOW_SECONDS * 1000).toISOString(),
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_terminal",
      stripe_price_id: PRICES.personalMonth,
    });
    const memory = new BillingMemoryDb([user]);
    const remote = subscription({
      id: "sub_terminal",
      status: "canceled",
      periodEnd: NOW_SECONDS,
    });
    const result = await reconcileStripeSubscriptions(envFor(memory), {
      now: new Date(NOW_SECONDS * 1000),
      runId: "reconcile-terminal-unlink",
      fetchImpl: stripeFetch(new Map([["sub_terminal", remote]])),
    });

    assert.equal(result.repaired, 1);
    assert.equal(result.unchanged, 0);
    assert.equal(user.stripe_subscription_id, null);
  });

  it("repairs missed cancellation updates and preserves the webhook cursor", async () => {
    const user = freeUser({
      account_type: "business_premium",
      plan: "business_premium",
      subscription_status: "active",
      subscription_current_period_end: new Date((NOW_SECONDS + 30 * DAY) * 1000).toISOString(),
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_1",
      stripe_price_id: PRICES.businessMonth,
      subscription_last_event_created: NOW_SECONDS - DAY,
    });
    const memory = new BillingMemoryDb([user]);
    const remote = subscription({
      status: "canceled",
      price: PRICES.businessMonth,
      periodEnd: NOW_SECONDS,
    });
    const result = await reconcileStripeSubscriptions(envFor(memory), {
      now: new Date(NOW_SECONDS * 1000),
      runId: "reconcile-1",
      fetchImpl: stripeFetch(new Map([["sub_1", remote]])),
    });

    assert.deepEqual(result, {
      runId: "reconcile-1",
      status: "completed",
      scanned: 1,
      repaired: 1,
      unchanged: 0,
      failed: 0,
    });
    assert.equal(entitlements(user, NOW_SECONDS + 1).accountType, "free");
    assert.equal(user.stripe_subscription_id, null);
    assert.equal(user.stripe_customer_id, "cus_1");
    assert.equal(user.subscription_last_event_created, NOW_SECONDS - DAY);
    assert.equal(user.subscription_reconciliation_error, null);
    assert.equal(memory.reconciliationRuns.get("reconcile-1")?.status, "completed");
  });

  it("records account-level Stripe failures and continues reconciling other users", async () => {
    const failedUser = freeUser({
      id: "user-failed",
      stripe_customer_id: "cus_failed",
      stripe_subscription_id: "sub_failed",
    });
    const repairedUser = freeUser({
      id: "user-repaired",
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_ok",
      subscription_status: "canceled",
    });
    const memory = new BillingMemoryDb([failedUser, repairedUser]);
    const okSubscription = subscription({ id: "sub_ok" });
    okSubscription.metadata = { privatenote_user_id: repairedUser.id };
    const result = await reconcileStripeSubscriptions(envFor(memory), {
      now: new Date(NOW_SECONDS * 1000),
      runId: "reconcile-partial",
      fetchImpl: stripeFetch(
        new Map([["sub_ok", okSubscription]]),
        new Set(["sub_failed"]),
      ),
    });

    assert.equal(result.status, "partial");
    assert.equal(result.scanned, 2);
    assert.equal(result.repaired, 1);
    assert.equal(result.failed, 1);
    assert.match(failedUser.subscription_reconciliation_error ?? "", /api_connection_error/);
    assert.equal(memory.reconciliationFailures.length, 1);
    assert.equal(memory.reconciliationFailures[0]?.userId, failedUser.id);
    assert.equal(entitlements(repairedUser).accountType, "personal_premium");
  });
});
