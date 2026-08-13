import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  D1Database,
  D1PreparedStatement,
} from "@cloudflare/workers-types";
import {
  cancelStripeSubscriptionImmediately,
  checkoutIdempotencyKey,
  cleanupBillingOperationalHistory,
  createStripeCheckoutSession,
  createStripePortalSession,
  createSubscriptionChangeSession,
  getStripeBillingConfigHealth,
  planForStripePrice,
  processStripeWebhookEvent,
  verifyStripeWebhookSignature,
  type StripeEvent,
} from "./stripeBilling";
import { BILLING_TERMS_VERSION } from "@shared/billingTerms";
import type { Env } from "./types";

const PRICES = {
  STRIPE_PRICE_PERSONAL_MONTHLY: "price_personal_month",
  STRIPE_PRICE_PERSONAL_YEARLY: "price_personal_year",
  STRIPE_PRICE_BUSINESS_MONTHLY: "price_business_month",
  STRIPE_PRICE_BUSINESS_YEARLY: "price_business_year",
  STRIPE_PRICE_PERSONAL_MONTHLY_EUR: "price_personal_month_eur",
  STRIPE_PRICE_PERSONAL_YEARLY_EUR: "price_personal_year_eur",
  STRIPE_PRICE_BUSINESS_MONTHLY_EUR: "price_business_month_eur",
  STRIPE_PRICE_BUSINESS_YEARLY_EUR: "price_business_year_eur",
};

async function signatureFor(
  payload: string,
  secret: string,
  timestamp: number,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`)),
  );
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

type SqlCall = {
  sql: string;
  bindings: unknown[];
  operation: "first" | "run";
};

function createBillingDb(options: {
  duplicateEvent?: boolean;
  existingEventState?: "failed" | "processing" | "stale_processing";
  existingEventAttempts?: number;
  gracePeriodEnd?: string | null;
  stripeSubscriptionId?: string | null;
} = {}): { db: D1Database; calls: SqlCall[] } {
  const calls: SqlCall[] = [];
  const webhookEvents = new Set<string>();
  let existingEventConsumed = false;
  return {
    calls,
    db: {
      prepare(sql: string) {
        let bindings: unknown[] = [];
        const statement = {
          bind(...values: unknown[]) {
            bindings = values;
            return statement;
          },
          async first() {
            calls.push({ sql, bindings, operation: "first" });
            if (sql.includes("FROM billing_webhook_events")) {
              if (options.duplicateEvent) {
                return { event_id: bindings[0], processing_status: "processed" };
              }
              if (options.existingEventState) {
                return {
                  event_id: bindings[0],
                  processing_status:
                    options.existingEventAttempts && options.existingEventAttempts >= 5
                      ? "dead_letter"
                      : options.existingEventState === "failed"
                        ? "failed"
                        : "processing",
                };
              }
              return null;
            }
            if (sql.includes("FROM users WHERE")) {
              return {
                id: "user-1",
                stripe_subscription_id: options.stripeSubscriptionId ?? null,
                subscription_grace_period_end: options.gracePeriodEnd ?? null,
                subscription_last_event_created: null,
              };
            }
            return null;
          },
          async run() {
            calls.push({ sql, bindings, operation: "run" });
            if (sql.includes("INSERT OR IGNORE INTO billing_webhook_events")) {
              const eventId = String(bindings[0]);
              if (
                !existingEventConsumed &&
                (options.duplicateEvent || options.existingEventState)
              ) {
                existingEventConsumed = true;
                webhookEvents.add(eventId);
                return { success: true, meta: { changes: 0 }, results: [] };
              }
              if (webhookEvents.has(eventId)) {
                return { success: true, meta: { changes: 0 }, results: [] };
              }
              webhookEvents.add(eventId);
            } else if (
              sql.includes("UPDATE billing_webhook_events") &&
              sql.includes("attempts < ?")
            ) {
              const reclaimable =
                options.existingEventState === "failed" ||
                options.existingEventState === "stale_processing";
              const attempts = options.existingEventAttempts ?? 1;
              return {
                success: true,
                meta: {
                  changes: reclaimable && attempts < Number(bindings[1]) ? 1 : 0,
                },
                results: [],
              };
            } else if (
              sql.includes("UPDATE billing_webhook_events") &&
              sql.includes("processing_status = 'dead_letter'")
            ) {
              const attempts = options.existingEventAttempts ?? 1;
              return {
                success: true,
                meta: { changes: attempts >= Number(bindings[1]) ? 1 : 0 },
                results: [],
              };
            }
            return { success: true, meta: { changes: 1 }, results: [] };
          },
          async all() {
            return { success: true, results: [], meta: {} };
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
    } as unknown as D1Database,
  };
}

function billingEnv(db?: D1Database): Env {
  return {
    AUTH_DB: db,
    STRIPE_SECRET_KEY: "sk_test_example",
    STRIPE_WEBHOOK_SECRET: "whsec_example",
    ...PRICES,
  } as unknown as Env;
}

describe("Stripe billing", () => {
  it("verifies the raw signed payload and rejects stale signatures", async () => {
    const payload = JSON.stringify({ id: "evt_1" });
    const secret = "whsec_test";
    const now = new Date("2026-07-28T12:00:00.000Z");
    const timestamp = Math.floor(now.getTime() / 1000);
    const signature = await signatureFor(payload, secret, timestamp);

    assert.equal(
      await verifyStripeWebhookSignature(
        payload,
        `t=${timestamp},v1=${signature}`,
        secret,
        now,
      ),
      true,
    );
    assert.equal(
      await verifyStripeWebhookSignature(
        `${payload} `,
        `t=${timestamp},v1=${signature}`,
        secret,
        now,
      ),
      false,
    );
    assert.equal(
      await verifyStripeWebhookSignature(
        payload,
        `t=${timestamp - 301},v1=${signature}`,
        secret,
        now,
      ),
      false,
    );
  });

  it("creates hosted subscription Checkout with trusted server-side Price IDs", async () => {
    let capturedRequest: Request | null = null;
    const fetchImpl: typeof fetch = async (input, init) => {
      capturedRequest = new Request(input, init);
      return Response.json({
        id: "cs_test_1",
        url: "https://checkout.stripe.com/c/pay/test",
      });
    };
    const result = await createStripeCheckoutSession(
      billingEnv(),
      {
        userId: "user-1",
        email: "person@example.com",
        stripeCustomerId: null,
        plan: "business_premium",
        interval: "year",
        currency: "eur",
        successUrl: "https://privatenote.ai/account?billing=success",
        cancelUrl: "https://privatenote.ai/premium?billing=cancelled",
        idempotencyKey: "checkout-user-1-test",
      },
      fetchImpl,
    );

    assert.equal(result.id, "cs_test_1");
    assert.ok(capturedRequest);
    const request = capturedRequest as Request;
    assert.equal(request.url, "https://api.stripe.com/v1/checkout/sessions");
    assert.equal(request.headers.get("Authorization"), "Bearer sk_test_example");
    assert.equal(request.headers.get("Stripe-Version"), "2025-03-31.basil");
    assert.equal(request.headers.get("Idempotency-Key"), "checkout-user-1-test");
    const form = new URLSearchParams(await request.text());
    assert.equal(form.get("mode"), "subscription");
    assert.equal(form.get("line_items[0][price]"), PRICES.STRIPE_PRICE_BUSINESS_YEARLY_EUR);
    assert.equal(form.get("client_reference_id"), "user-1");
    assert.equal(form.get("automatic_tax[enabled]"), "false");
    assert.equal(form.get("tax_id_collection[enabled]"), "true");
    assert.equal(form.get("billing_address_collection"), "required");
    assert.equal(form.get("consent_collection[terms_of_service]"), "required");
    assert.match(
      form.get("custom_text[submit][message]") ?? "",
      /renews automatically until cancelled/,
    );
    assert.equal(form.get("subscription_data[invoice_settings][footer]"), null);
    assert.match(
      form.get("subscription_data[description]") ?? "",
      /Article 57bis/,
    );
    assert.equal(form.get("subscription_data[metadata][privatenote_user_id]"), "user-1");
    assert.equal(form.get("subscription_data[metadata][privatenote_currency]"), "eur");
    assert.equal(
      form.get("subscription_data[metadata][privatenote_terms_version]"),
      BILLING_TERMS_VERSION,
    );
    assert.equal(form.get("customer_update[address]"), null);
    assert.equal(form.get("customer_update[name]"), null);
  });

  // Regression: Checkout answers 400 "Received unknown parameter:
  // subscription_data[invoice_settings][footer]" on Dahlia too, which took the
  // staging subscribe button down.
  it("never sends the unsupported subscription invoice_settings footer", async () => {
    let capturedRequest: Request | null = null;
    const fetchImpl: typeof fetch = async (input, init) => {
      capturedRequest = new Request(input, init);
      return Response.json({
        id: "cs_dahlia",
        url: "https://checkout.stripe.com/c/pay/dahlia",
      });
    };

    await createStripeCheckoutSession(
      {
        ...billingEnv(),
        STRIPE_API_VERSION: "2026-07-29.dahlia",
      },
      {
        userId: "user-1",
        email: "user@example.com",
        stripeCustomerId: null,
        plan: "personal_premium",
        interval: "month",
        currency: "eur",
        successUrl: "https://example.com/ok",
        cancelUrl: "https://example.com/cancel",
        idempotencyKey: "checkout-dahlia",
      },
      fetchImpl,
    );

    assert.ok(capturedRequest);
    const request = capturedRequest as Request;
    assert.equal(request.headers.get("Stripe-Version"), "2026-07-29.dahlia");
    const form = new URLSearchParams(await request.text());
    assert.equal(form.get("subscription_data[invoice_settings][footer]"), null);
    assert.match(form.get("subscription_data[description]") ?? "", /Article 57bis/);
  });

  it("updates billing identity fields for an existing Stripe customer", async () => {
    let capturedRequest: Request | null = null;
    const fetchImpl: typeof fetch = async (input, init) => {
      capturedRequest = new Request(input, init);
      return Response.json({
        id: "cs_existing_customer",
        url: "https://checkout.stripe.com/c/pay/existing",
      });
    };

    await createStripeCheckoutSession(
      billingEnv(),
      {
        userId: "user-existing",
        email: "existing@example.com",
        stripeCustomerId: "cus_existing",
        plan: "personal_premium",
        interval: "month",
        currency: "usd",
        successUrl: "https://privatenote.ai/account?billing=success",
        cancelUrl: "https://privatenote.ai/premium?billing=cancelled",
        idempotencyKey: "checkout-user-existing-test",
      },
      fetchImpl,
    );

    assert.ok(capturedRequest);
    const form = new URLSearchParams(
      await (capturedRequest as Request).text(),
    );
    assert.equal(form.get("customer"), "cus_existing");
    assert.equal(form.get("customer_email"), null);
    assert.equal(form.get("customer_update[address]"), "auto");
    assert.equal(form.get("customer_update[name]"), "auto");
  });

  it("uses a stable checkout idempotency key within the retry window", () => {
    const first = checkoutIdempotencyKey(
      "user-1",
      "personal_premium",
      "month",
      new Date("2026-07-29T10:01:00.000Z"),
    );
    const retry = checkoutIdempotencyKey(
      "user-1",
      "personal_premium",
      "month",
      new Date("2026-07-29T10:04:59.000Z"),
    );
    const later = checkoutIdempotencyKey(
      "user-1",
      "personal_premium",
      "month",
      new Date("2026-07-29T10:05:00.000Z"),
    );
    assert.equal(first, retry);
    assert.notEqual(first, later);
  });

  it("creates a configured Portal deep link for subscription plan changes", async () => {
    let capturedRequest: Request | null = null;
    const fetchImpl: typeof fetch = async (input, init) => {
      capturedRequest = new Request(input, init);
      return Response.json({
        id: "bps_test_1",
        url: "https://billing.stripe.com/p/session/test",
      });
    };
    const env = {
      ...billingEnv(),
      STRIPE_PORTAL_CONFIGURATION_ID: "bpc_test_catalog",
    };
    const result = await createStripePortalSession(
      env,
      {
        stripeCustomerId: "cus_test_1",
        subscriptionId: "sub_test_1",
        flow: "subscription_update",
        returnUrl: "https://privatenote.ai/account/subscription?billing=updated",
      },
      fetchImpl,
    );

    assert.equal(result.id, "bps_test_1");
    assert.ok(capturedRequest);
    const form = new URLSearchParams(
      await (capturedRequest as Request).text(),
    );
    assert.equal(form.get("customer"), "cus_test_1");
    assert.equal(form.get("configuration"), "bpc_test_catalog");
    assert.equal(form.get("flow_data[type]"), "subscription_update");
    assert.equal(
      form.get("flow_data[subscription_update][subscription]"),
      "sub_test_1",
    );
    assert.equal(form.get("flow_data[after_completion][type]"), "redirect");
  });

  it("deep-links into the Portal cancellation flow", async () => {
    let capturedRequest: Request | null = null;
    const fetchImpl: typeof fetch = async (input, init) => {
      capturedRequest = new Request(input, init);
      return Response.json({
        id: "bps_cancel_1",
        url: "https://billing.stripe.com/p/session/cancel",
      });
    };

    await createStripePortalSession(
      billingEnv(),
      {
        stripeCustomerId: "cus_test_1",
        subscriptionId: "sub_test_1",
        flow: "subscription_cancel",
        returnUrl: "https://privatenote.ai/account",
      },
      fetchImpl,
    );

    assert.ok(capturedRequest);
    const form = new URLSearchParams(await (capturedRequest as Request).text());
    assert.equal(form.get("flow_data[type]"), "subscription_cancel");
    assert.equal(
      form.get("flow_data[subscription_cancel][subscription]"),
      "sub_test_1",
    );
    assert.equal(
      form.get("flow_data[after_completion][redirect][return_url]"),
      "https://privatenote.ai/account",
    );
  });

  it("refuses a cancellation deep link without a subscription", async () => {
    await assert.rejects(
      createStripePortalSession(
        billingEnv(),
        {
          stripeCustomerId: "cus_test_1",
          subscriptionId: null,
          flow: "subscription_cancel",
          returnUrl: "https://privatenote.ai/account",
        },
        async () => Response.json({ id: "bps_x", url: "https://example.com" }),
      ),
      /No active subscription/,
    );
  });

  it("cancels a subscription outright for account deletion", async () => {
    let capturedRequest: Request | null = null;
    const fetchImpl: typeof fetch = async (input, init) => {
      capturedRequest = new Request(input, init);
      return Response.json({ id: "sub_test_1", status: "canceled" });
    };

    const result = await cancelStripeSubscriptionImmediately(
      billingEnv(),
      "sub_test_1",
      fetchImpl,
    );

    assert.equal(result.status, "canceled");
    assert.ok(capturedRequest);
    const request = capturedRequest as Request;
    assert.equal(request.method, "DELETE");
    assert.equal(
      new URL(request.url).pathname,
      "/v1/subscriptions/sub_test_1",
    );
  });

  it("preselects the clicked plan in the customer's own currency", async () => {
    const requests: Array<{ url: string; body: string }> = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      const request = new Request(input, init);
      requests.push({ url: request.url, body: await request.text() });
      if (request.url.includes("/v1/subscriptions/")) {
        return Response.json({
          id: "sub_eur_1",
          items: {
            data: [{ id: "si_eur_1", price: { id: PRICES.STRIPE_PRICE_PERSONAL_YEARLY_EUR } }],
          },
        });
      }
      return Response.json({
        id: "bps_confirm_1",
        url: "https://billing.stripe.com/p/session/confirm",
      });
    };

    const result = await createSubscriptionChangeSession(
      { ...billingEnv(), STRIPE_PORTAL_CONFIGURATION_ID: "bpc_test_catalog" },
      {
        stripeCustomerId: "cus_eur_1",
        subscriptionId: "sub_eur_1",
        plan: "business_premium",
        interval: "year",
        // A USD fallback must not win over the subscription's EUR price.
        fallbackCurrency: "usd",
        returnUrl: "https://privatenote.ai/account?billing=updated",
      },
      fetchImpl,
    );

    assert.equal(result.flow, "subscription_update_confirm");
    const portal = new URLSearchParams(requests.at(-1)?.body ?? "");
    assert.equal(portal.get("flow_data[type]"), "subscription_update_confirm");
    assert.equal(
      portal.get("flow_data[subscription_update_confirm][subscription]"),
      "sub_eur_1",
    );
    assert.equal(
      portal.get("flow_data[subscription_update_confirm][items][0][id]"),
      "si_eur_1",
    );
    assert.equal(
      portal.get("flow_data[subscription_update_confirm][items][0][price]"),
      PRICES.STRIPE_PRICE_BUSINESS_YEARLY_EUR,
    );
  });

  it("falls back to the portal home when no switchable products are configured", async () => {
    const flows: Array<string | null> = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      const request = new Request(input, init);
      if (request.url.includes("/v1/subscriptions/")) {
        return Response.json({
          id: "sub_1",
          items: { data: [{ id: "si_1", price: { id: PRICES.STRIPE_PRICE_PERSONAL_MONTHLY } }] },
        });
      }
      const form = new URLSearchParams(await request.text());
      const flow = form.get("flow_data[type]");
      flows.push(flow);
      // Mirrors the live failure: the portal configuration lists no products.
      if (flow) {
        return Response.json(
          {
            error: {
              message:
                "The subscription cannot be updated because there is no price in the portal configuration available to change to and the quantity cannot be changed.",
            },
          },
          { status: 400 },
        );
      }
      return Response.json({
        id: "bps_manage_1",
        url: "https://billing.stripe.com/p/session/manage",
      });
    };

    const result = await createSubscriptionChangeSession(
      billingEnv(),
      {
        stripeCustomerId: "cus_1",
        subscriptionId: "sub_1",
        plan: "business_premium",
        interval: "month",
        fallbackCurrency: "usd",
        returnUrl: "https://privatenote.ai/account?billing=updated",
      },
      fetchImpl,
    );

    assert.equal(result.flow, "manage");
    assert.equal(result.url, "https://billing.stripe.com/p/session/manage");
    assert.deepEqual(flows, ["subscription_update_confirm", "subscription_update", null]);
  });

  it("validates all eight configured recurring regional Stripe prices", async () => {
    const health = await getStripeBillingConfigHealth(
      billingEnv(),
      async (input, init) => {
        const request = new Request(input, init);
        const id = decodeURIComponent(request.url.split("/").pop() ?? "");
        const interval = id.includes("year") ? "year" : "month";
        const unitAmount = id.includes("personal")
          ? interval === "year" ? 4_000 : 400
          : interval === "year" ? 12_000 : 1_200;
        return Response.json({
          id,
          active: true,
          type: "recurring",
          unit_amount: unitAmount,
          currency: id.endsWith("_eur") ? "eur" : "usd",
          recurring: { interval },
        });
      },
    );
    assert.equal(health.ok, true);
    assert.equal(health.prices.length, 8);
    assert.equal(health.prices.every((price) => price.reachable), true);
    assert.equal(health.prices.every((price) => price.amountMatches), true);
    assert.equal(health.prices.every((price) => price.currencyMatches), true);
  });

  it("rejects a reachable Stripe price with a catalog amount or currency mismatch", async () => {
    const health = await getStripeBillingConfigHealth(
      billingEnv(),
      async (input, init) => {
        const request = new Request(input, init);
        const id = decodeURIComponent(request.url.split("/").pop() ?? "");
        const interval = id.includes("year") ? "year" : "month";
        return Response.json({
          id,
          active: true,
          type: "recurring",
          unit_amount: 1,
          currency: id.endsWith("_eur") ? "usd" : "eur",
          recurring: { interval },
        });
      },
    );
    assert.equal(health.ok, false);
    assert.equal(health.prices.every((price) => price.amountMatches === false), true);
    assert.equal(health.prices.every((price) => price.currencyMatches === false), true);
  });

  it("maps only configured Stripe prices to paid plans", () => {
    const env = billingEnv();
    assert.equal(
      planForStripePrice(env, PRICES.STRIPE_PRICE_PERSONAL_MONTHLY),
      "personal_premium",
    );
    assert.equal(
      planForStripePrice(env, PRICES.STRIPE_PRICE_BUSINESS_YEARLY_EUR),
      "business_premium",
    );
    assert.equal(planForStripePrice(env, "price_attacker_controlled"), null);
  });

  it("synchronizes subscription state and records the event idempotently", async () => {
    const { db, calls } = createBillingDb();
    const event: StripeEvent = {
      id: "evt_subscription_updated",
      type: "customer.subscription.updated",
      created: 1_785_240_000,
      data: {
        object: {
          id: "sub_1",
          customer: "cus_1",
          status: "active",
          metadata: { privatenote_user_id: "user-1" },
          items: {
            data: [{
              current_period_end: 1_787_918_400,
              price: { id: PRICES.STRIPE_PRICE_PERSONAL_MONTHLY },
            }],
          },
        },
      },
    };
    const result = await processStripeWebhookEvent(billingEnv(db), event);
    assert.deepEqual(result, {
      duplicate: false,
      handled: true,
      userId: "user-1",
    });

    const update = calls.find(
      ({ sql, operation }) => operation === "run" && sql.includes("UPDATE users"),
    );
    assert.ok(update);
    assert.equal(update.bindings[0], "personal_premium");
    assert.equal(update.bindings[2], "active");
    assert.equal(update.bindings[5], "cus_1");
    assert.equal(update.bindings[6], "sub_1");
    assert.match(update.sql, /subscription_last_event_created <= \?/);
    assert.equal(
      calls.some(
        ({ sql, operation }) =>
          operation === "run" &&
          sql.includes("INSERT OR IGNORE INTO billing_webhook_events"),
      ),
      true,
    );
  });

  it("fails closed when a subscription contains an unknown Price ID", async () => {
    const { db, calls } = createBillingDb();
    const result = await processStripeWebhookEvent(billingEnv(db), {
      id: "evt_unknown_price",
      type: "customer.subscription.updated",
      created: 1_785_240_000,
      data: {
        object: {
          id: "sub_unknown",
          customer: "cus_1",
          status: "active",
          metadata: { privatenote_user_id: "user-1" },
          items: {
            data: [{
              current_period_end: 1_787_918_400,
              price: { id: "price_unknown" },
            }],
          },
        },
      },
    });
    const update = calls.find(({ sql }) => sql.includes("UPDATE users"));
    assert.equal(update?.bindings[0], "free");
    assert.equal(update?.bindings[1], "free");
    assert.equal(result.warning?.code, "unknown_stripe_price");
    const completion = calls.find(
      ({ sql }) =>
        sql.includes("UPDATE billing_webhook_events") &&
        sql.includes("processing_status = ?"),
    );
    assert.equal(completion?.bindings[0], "processed_with_error");
    assert.equal(completion?.bindings[2], "unknown_stripe_price");
  });

  it("creates an explicit fixed grace deadline after payment failure", async () => {
    const { db, calls } = createBillingDb({ stripeSubscriptionId: "sub_1" });
    const fetchImpl: typeof fetch = async () => Response.json({
      id: "sub_1",
      customer: "cus_1",
      status: "past_due",
      metadata: { privatenote_user_id: "user-1" },
      items: {
        data: [{
          current_period_end: 1_785_153_600,
          price: { id: PRICES.STRIPE_PRICE_PERSONAL_MONTHLY },
        }],
      },
    });
    await processStripeWebhookEvent(
      {
        ...billingEnv(db),
        STRIPE_GRACE_PERIOD_DAYS: "3",
      },
      {
        id: "evt_payment_failed",
        type: "invoice.payment_failed",
        created: 1_785_240_000,
        data: { object: { subscription: "sub_1" } },
      },
      fetchImpl,
    );
    const update = calls.find(({ sql }) => sql.includes("UPDATE users"));
    assert.equal(
      update?.bindings[4],
      new Date((1_785_240_000 + 3 * 24 * 60 * 60) * 1000).toISOString(),
    );
    const notification = calls.find(
      ({ sql }) => sql.includes("INSERT OR IGNORE INTO billing_customer_notifications"),
    );
    assert.equal(notification?.bindings[4], "payment_failed");
    assert.equal(notification?.bindings[5], update?.bindings[4]);
  });

  it("uses Stripe's next retry and treats an empty grace setting as the default", async () => {
    const { db, calls } = createBillingDb({ stripeSubscriptionId: "sub_1" });
    const fetchImpl: typeof fetch = async () => Response.json({
      id: "sub_1",
      customer: "cus_1",
      status: "past_due",
      metadata: { privatenote_user_id: "user-1" },
      items: {
        data: [{
          current_period_end: 1_785_153_600,
          price: { id: PRICES.STRIPE_PRICE_PERSONAL_MONTHLY },
        }],
      },
    });
    const created = 1_785_240_000;
    const nextAttempt = created + 7 * 24 * 60 * 60;
    await processStripeWebhookEvent(
      { ...billingEnv(db), STRIPE_GRACE_PERIOD_DAYS: "" },
      {
        id: "evt_retry_scheduled",
        type: "invoice.payment_failed",
        created,
        data: {
          object: {
            subscription: "sub_1",
            next_payment_attempt: nextAttempt,
          },
        },
      },
      fetchImpl,
    );
    const update = calls.find(({ sql }) => sql.includes("UPDATE users"));
    assert.equal(
      update?.bindings[4],
      new Date((nextAttempt + 24 * 60 * 60) * 1000).toISOString(),
    );
  });

  it("does not create grace from a healthy scheduled invoice update", async () => {
    const { db, calls } = createBillingDb({ stripeSubscriptionId: "sub_1" });
    const result = await processStripeWebhookEvent(
      billingEnv(db),
      {
        id: "evt_healthy_invoice_update",
        type: "invoice.updated",
        created: 1_785_240_000,
        data: {
          object: {
            subscription: "sub_1",
            attempt_count: 0,
            next_payment_attempt: 1_785_326_400,
          },
        },
      },
      async () => {
        throw new Error("Healthy invoice updates must not retrieve the subscription.");
      },
    );
    assert.equal(result.handled, false);
    assert.equal(calls.some(({ sql }) => sql.includes("UPDATE users")), false);
  });

  it("queues trial-ending and cancellation confirmations idempotently", async () => {
    const { db, calls } = createBillingDb();
    await processStripeWebhookEvent(billingEnv(db), {
      id: "evt_trial_will_end",
      type: "customer.subscription.trial_will_end",
      created: 1_785_240_000,
      data: {
        object: {
          id: "sub_1",
          customer: "cus_1",
          status: "trialing",
          trial_end: 1_785_499_200,
          metadata: { privatenote_user_id: "user-1" },
          items: { data: [{ current_period_end: 1_785_499_200, price: { id: PRICES.STRIPE_PRICE_PERSONAL_MONTHLY } }] },
        },
      },
    });
    await processStripeWebhookEvent(billingEnv(db), {
      id: "evt_cancel_scheduled",
      type: "customer.subscription.updated",
      created: 1_785_240_001,
      data: {
        object: {
          id: "sub_1",
          customer: "cus_1",
          status: "active",
          cancel_at_period_end: true,
          metadata: { privatenote_user_id: "user-1" },
          items: { data: [{ current_period_end: 1_787_918_400, price: { id: PRICES.STRIPE_PRICE_PERSONAL_MONTHLY } }] },
        },
      },
    });
    const notifications = calls.filter(
      ({ sql }) => sql.includes("INSERT OR IGNORE INTO billing_customer_notifications"),
    );
    assert.deepEqual(notifications.map(({ bindings }) => bindings[4]), [
      "trial_ending",
      "cancellation_confirmed",
    ]);
  });

  it("does not let an old subscription overwrite the currently linked subscription", async () => {
    const { db, calls } = createBillingDb({
      stripeSubscriptionId: "sub_current",
    });
    const result = await processStripeWebhookEvent(billingEnv(db), {
      id: "evt_old_subscription",
      type: "customer.subscription.deleted",
      created: 1_785_240_000,
      data: {
        object: {
          id: "sub_old",
          customer: "cus_1",
          status: "canceled",
          metadata: { privatenote_user_id: "user-1" },
          items: {
            data: [{
              current_period_end: 1_785_153_600,
              price: { id: PRICES.STRIPE_PRICE_PERSONAL_MONTHLY },
            }],
          },
        },
      },
    });
    assert.equal(result.userId, null);
    assert.equal(calls.some(({ sql }) => sql.includes("UPDATE users")), false);
  });

  it("short-circuits already processed webhook events", async () => {
    const { db, calls } = createBillingDb({ duplicateEvent: true });
    const result = await processStripeWebhookEvent(billingEnv(db), {
      id: "evt_duplicate",
      type: "customer.subscription.deleted",
      created: 1_785_240_000,
      data: { object: { id: "sub_1" } },
    });
    assert.equal(result.duplicate, true);
    assert.equal(calls.some(({ sql }) => sql.includes("UPDATE users")), false);
  });

  it("reclaims stale in-flight webhook events after fifteen minutes", async () => {
    const { db, calls } = createBillingDb({
      existingEventState: "stale_processing",
      existingEventAttempts: 1,
    });
    const result = await processStripeWebhookEvent(billingEnv(db), {
      id: "evt_stale",
      type: "customer.subscription.updated",
      created: 1_785_240_000,
      data: {
        object: {
          id: "sub_1",
          customer: "cus_1",
          status: "active",
          metadata: { privatenote_user_id: "user-1" },
          items: {
            data: [{
              current_period_end: 1_787_918_400,
              price: { id: PRICES.STRIPE_PRICE_PERSONAL_MONTHLY },
            }],
          },
        },
      },
    });
    assert.equal(result.duplicate, false);
    assert.equal(calls.some(({ sql }) => sql.includes("UPDATE users")), true);
  });

  it("asks Stripe to retry while another delivery is still processing", async () => {
    const { db } = createBillingDb({
      existingEventState: "processing",
      existingEventAttempts: 1,
    });
    await assert.rejects(
      processStripeWebhookEvent(billingEnv(db), {
        id: "evt_concurrent",
        type: "customer.subscription.updated",
        created: 1_785_240_000,
        data: { object: {} },
      }),
      (error: unknown) =>
        error instanceof Error &&
        "code" in error &&
        error.code === "webhook_processing_in_progress",
    );
  });

  it("dead-letters webhook events after the processing-attempt cap", async () => {
    const { db, calls } = createBillingDb({
      existingEventState: "stale_processing",
      existingEventAttempts: 5,
    });
    const result = await processStripeWebhookEvent(billingEnv(db), {
      id: "evt_poison",
      type: "customer.subscription.updated",
      created: 1_785_240_000,
      data: { object: {} },
    });
    assert.equal(result.duplicate, true);
    assert.equal(
      calls.some(
        ({ sql }) =>
          sql.includes("processing_status = 'dead_letter'") &&
          sql.includes("webhook_attempts_exhausted"),
      ),
      true,
    );
  });

  it("prunes only aged terminal billing-operation records", async () => {
    const { db, calls } = createBillingDb();
    const result = await cleanupBillingOperationalHistory(
      billingEnv(db),
      new Date("2026-07-29T12:00:00.000Z"),
    );
    assert.deepEqual(result, {
      webhookEvents: 1,
      reconciliationRuns: 1,
      reconciliationFailures: 1,
      customerNotifications: 1,
    });
    assert.equal(
      calls.some(
        ({ sql }) =>
          sql.includes("DELETE FROM billing_webhook_events") &&
          sql.includes("processed_with_error"),
      ),
      true,
    );
    assert.equal(
      calls.some(
        ({ sql }) =>
          sql.includes("DELETE FROM billing_customer_notifications") &&
          sql.includes("'sent', 'failed', 'skipped'"),
      ),
      true,
    );
  });
});
