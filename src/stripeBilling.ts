import type { D1Database } from "@cloudflare/workers-types";
import {
  planPriceFor,
  type AccountType,
  type BillingCurrency,
} from "@shared/planCatalog";
import { BILLING_INVOICE_VAT_FOOTER, BILLING_TERMS_VERSION } from "@shared/billingTerms";
import type { Env } from "./types";
import { queueBillingNotification } from "./billingCommunications";

export type PaidBillingPlan = Exclude<AccountType, "free">;
export type BillingInterval = "month" | "year";

type StripeMetadata = Record<string, string | undefined>;

export type StripeSubscription = {
  id: string;
  customer?: string | { id?: string } | null;
  status?: string | null;
  current_period_end?: number | null;
  ended_at?: number | null;
  cancel_at_period_end?: boolean | null;
  cancel_at?: number | null;
  canceled_at?: number | null;
  trial_end?: number | null;
  metadata?: StripeMetadata | null;
  items?: {
    data?: Array<{
      id?: string | null;
      current_period_end?: number | null;
      price?: { id?: string | null } | string | null;
    }>;
  } | null;
};

type StripeSubscriptionList = {
  data?: StripeSubscription[];
  has_more?: boolean;
};

export type StripeEvent = {
  id: string;
  type: string;
  created: number;
  data: { object: Record<string, unknown> };
};

const DEFAULT_STRIPE_API_VERSION = "2025-03-31.basil";
const TERMINAL_SUBSCRIPTION_STATUSES = new Set(["canceled", "incomplete_expired"]);
const ORPHAN_RECONCILIATION_CURSOR_KEY = "stripe_subscription_discovery_cursor";
const MAX_WEBHOOK_PROCESSING_ATTEMPTS = 5;
const ORPHAN_DISCOVERY_STATUSES = [
  "active",
  "trialing",
  "past_due",
  "unpaid",
  "paused",
  "incomplete",
] as const;

type StripeApiErrorBody = {
  error?: { message?: string; type?: string; code?: string };
};

export class StripeBillingError extends Error {
  constructor(
    message: string,
    readonly status = 502,
    readonly code = "stripe_error",
    readonly providerStatus?: number,
  ) {
    super(message);
  }
}

function asId(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "string" && id.trim() ? id.trim() : null;
  }
  return null;
}

function unixSecondsToIso(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return null;
  return new Date(value * 1000).toISOString();
}

function subscriptionPeriodEnd(subscription: StripeSubscription): string | null {
  const legacy = unixSecondsToIso(subscription.current_period_end);
  if (legacy) return legacy;
  const itemEnds = (subscription.items?.data ?? [])
    .map((item) => item.current_period_end)
    .filter((value): value is number =>
      typeof value === "number" && Number.isFinite(value) && value > 0
    );
  return itemEnds.length ? unixSecondsToIso(Math.max(...itemEnds)) : null;
}

/**
 * True when the subscription is still active but already scheduled to end.
 *
 * Stripe no longer always expresses this as `cancel_at_period_end`: cancelling
 * through the Customer Portal leaves that boolean false and instead sets
 * `cancel_at` to the end of the paid period (with `canceled_at` recording when
 * the customer asked). Reading only the boolean made us report such a
 * subscription as renewing normally.
 */
function subscriptionCancelsAtPeriodEnd(
  subscription: StripeSubscription,
): boolean {
  if (subscription.cancel_at_period_end === true) return true;
  const cancelAt = subscription.cancel_at;
  return typeof cancelAt === "number" && Number.isFinite(cancelAt) && cancelAt > 0;
}

function subscriptionPriceId(subscription: StripeSubscription): string | null {
  for (const item of subscription.items?.data ?? []) {
    const id = asId(item.price);
    if (id) return id;
  }
  return null;
}

export function stripePriceIdFor(
  env: Env,
  plan: PaidBillingPlan,
  interval: BillingInterval,
  currency: BillingCurrency = "usd",
): string | null {
  const value =
    currency === "eur"
      ? plan === "personal_premium"
        ? interval === "month"
          ? env.STRIPE_PRICE_PERSONAL_MONTHLY_EUR
          : env.STRIPE_PRICE_PERSONAL_YEARLY_EUR
        : interval === "month"
          ? env.STRIPE_PRICE_BUSINESS_MONTHLY_EUR
          : env.STRIPE_PRICE_BUSINESS_YEARLY_EUR
      : plan === "personal_premium"
        ? interval === "month"
          ? env.STRIPE_PRICE_PERSONAL_MONTHLY
          : env.STRIPE_PRICE_PERSONAL_YEARLY
        : interval === "month"
          ? env.STRIPE_PRICE_BUSINESS_MONTHLY
          : env.STRIPE_PRICE_BUSINESS_YEARLY;
  return value?.trim() || null;
}

export function planForStripePrice(env: Env, priceId: string | null): PaidBillingPlan | null {
  if (!priceId) return null;
  if (
    priceId === env.STRIPE_PRICE_PERSONAL_MONTHLY ||
    priceId === env.STRIPE_PRICE_PERSONAL_YEARLY ||
    priceId === env.STRIPE_PRICE_PERSONAL_MONTHLY_EUR ||
    priceId === env.STRIPE_PRICE_PERSONAL_YEARLY_EUR
  ) {
    return "personal_premium";
  }
  if (
    priceId === env.STRIPE_PRICE_BUSINESS_MONTHLY ||
    priceId === env.STRIPE_PRICE_BUSINESS_YEARLY ||
    priceId === env.STRIPE_PRICE_BUSINESS_MONTHLY_EUR ||
    priceId === env.STRIPE_PRICE_BUSINESS_YEARLY_EUR
  ) {
    return "business_premium";
  }
  return null;
}

export function billingIntervalForStripePrice(
  env: Env,
  priceId: string | null,
): BillingInterval | null {
  if (!priceId) return null;
  if (
    priceId === env.STRIPE_PRICE_PERSONAL_MONTHLY ||
    priceId === env.STRIPE_PRICE_BUSINESS_MONTHLY ||
    priceId === env.STRIPE_PRICE_PERSONAL_MONTHLY_EUR ||
    priceId === env.STRIPE_PRICE_BUSINESS_MONTHLY_EUR
  ) {
    return "month";
  }
  if (
    priceId === env.STRIPE_PRICE_PERSONAL_YEARLY ||
    priceId === env.STRIPE_PRICE_BUSINESS_YEARLY ||
    priceId === env.STRIPE_PRICE_PERSONAL_YEARLY_EUR ||
    priceId === env.STRIPE_PRICE_BUSINESS_YEARLY_EUR
  ) {
    return "year";
  }
  return null;
}

export function billingCurrencyForStripePrice(
  env: Env,
  priceId: string | null,
): BillingCurrency | null {
  if (!priceId) return null;
  if (
    priceId === env.STRIPE_PRICE_PERSONAL_MONTHLY_EUR ||
    priceId === env.STRIPE_PRICE_PERSONAL_YEARLY_EUR ||
    priceId === env.STRIPE_PRICE_BUSINESS_MONTHLY_EUR ||
    priceId === env.STRIPE_PRICE_BUSINESS_YEARLY_EUR
  ) {
    return "eur";
  }
  return planForStripePrice(env, priceId) ? "usd" : null;
}

export function checkoutIdempotencyKey(
  userId: string,
  plan: PaidBillingPlan,
  interval: BillingInterval,
  now = new Date(),
  currency: BillingCurrency = "usd",
): string {
  const fiveMinuteBucket = Math.floor(now.getTime() / (5 * 60 * 1000));
  return `checkout-${userId}-${plan}-${interval}-${currency}-${fiveMinuteBucket}`;
}

function configuredGraceDays(env: Env): number {
  const raw = env.STRIPE_GRACE_PERIOD_DAYS?.trim();
  const parsed = Number(raw || "3");
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 30
    ? Math.floor(parsed)
    : 3;
}

function configuredStripeApiVersion(env: Env): string {
  return env.STRIPE_API_VERSION?.trim() || DEFAULT_STRIPE_API_VERSION;
}

async function stripeApiRequest<T>(
  env: Env,
  path: string,
  options: {
    method?: "GET" | "POST" | "DELETE";
    form?: URLSearchParams;
    idempotencyKey?: string;
    fetchImpl?: typeof fetch;
  } = {},
): Promise<T> {
  const secret = env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    throw new StripeBillingError(
      "Stripe billing is not configured.",
      503,
      "billing_not_configured",
    );
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  const headers = new Headers({
    Authorization: `Bearer ${secret}`,
    "Stripe-Version": configuredStripeApiVersion(env),
  });
  if (options.form) {
    headers.set("Content-Type", "application/x-www-form-urlencoded");
  }
  if (options.idempotencyKey) {
    headers.set("Idempotency-Key", options.idempotencyKey);
  }
  const response = await fetchImpl(`https://api.stripe.com${path}`, {
    method: options.method ?? (options.form ? "POST" : "GET"),
    headers,
    body: options.form,
  });
  const body = await response.json() as T & StripeApiErrorBody;
  if (!response.ok) {
    throw new StripeBillingError(
      body.error?.message || "Stripe rejected the billing request.",
      response.status >= 400 && response.status < 500 ? 400 : 502,
      body.error?.code || "stripe_error",
      response.status,
    );
  }
  return body;
}

/**
 * End a subscription now, without proration or a refund.
 *
 * Only for cases where the customer keeps no way back into billing — account
 * deletion, where there is no account left to sign in with and the portal has
 * no customer login page. Scheduled cancellations belong in the portal so the
 * customer keeps the period they already paid for.
 */
export async function cancelStripeSubscriptionImmediately(
  env: Env,
  subscriptionId: string,
  fetchImpl?: typeof fetch,
): Promise<StripeSubscription> {
  return stripeApiRequest<StripeSubscription>(
    env,
    `/v1/subscriptions/${encodeURIComponent(subscriptionId)}`,
    { method: "DELETE", fetchImpl },
  );
}

async function applyInvoiceVatFooter(
  env: Env,
  invoiceId: string,
  fetchImpl?: typeof fetch,
): Promise<void> {
  const form = new URLSearchParams({ footer: BILLING_INVOICE_VAT_FOOTER });
  await stripeApiRequest(env, `/v1/invoices/${encodeURIComponent(invoiceId)}`, {
    form,
    fetchImpl,
  });
}

export async function createStripeCheckoutSession(
  env: Env,
  input: {
    userId: string;
    email: string | null;
    stripeCustomerId: string | null;
    plan: PaidBillingPlan;
    interval: BillingInterval;
    currency: BillingCurrency;
    successUrl: string;
    cancelUrl: string;
    idempotencyKey: string;
  },
  fetchImpl?: typeof fetch,
): Promise<{ id: string; url: string }> {
  const priceId = stripePriceIdFor(
    env,
    input.plan,
    input.interval,
    input.currency,
  );
  if (!priceId) {
    throw new StripeBillingError(
      "The selected billing price is not configured.",
      503,
      "price_not_configured",
    );
  }
  const form = new URLSearchParams();
  form.set("mode", "subscription");
  form.set("line_items[0][price]", priceId);
  form.set("line_items[0][quantity]", "1");
  form.set("client_reference_id", input.userId);
  form.set("success_url", input.successUrl);
  form.set("cancel_url", input.cancelUrl);
  form.set("allow_promotion_codes", "true");
  form.set("automatic_tax[enabled]", "false");
  form.set("tax_id_collection[enabled]", "true");
  form.set("billing_address_collection", "required");
  form.set("consent_collection[terms_of_service]", "required");
  form.set(
    "custom_text[submit][message]",
    "This subscription renews automatically until cancelled. By paying, you expressly request immediate access during the 14-day EU withdrawal period. Cancellation normally takes effect at the end of the current billing period.",
  );
  form.set("metadata[privatenote_user_id]", input.userId);
  form.set("metadata[privatenote_plan]", input.plan);
  form.set("metadata[privatenote_currency]", input.currency);
  form.set("metadata[privatenote_terms_version]", BILLING_TERMS_VERSION);
  // Checkout rejects subscription_data[invoice_settings][footer] on every API
  // version, including Dahlia. Carry the VAT note as the subscription
  // description here; renewal drafts get the real footer via the
  // invoice.created webhook (see applyInvoiceVatFooter).
  form.set("subscription_data[description]", BILLING_INVOICE_VAT_FOOTER);
  form.set("subscription_data[metadata][privatenote_user_id]", input.userId);
  form.set("subscription_data[metadata][privatenote_plan]", input.plan);
  form.set("subscription_data[metadata][privatenote_currency]", input.currency);
  form.set(
    "subscription_data[metadata][privatenote_terms_version]",
    BILLING_TERMS_VERSION,
  );
  if (input.stripeCustomerId) {
    form.set("customer", input.stripeCustomerId);
    form.set("customer_update[address]", "auto");
    form.set("customer_update[name]", "auto");
  } else if (input.email) {
    form.set("customer_email", input.email);
  }
  return stripeApiRequest<{ id: string; url: string }>(
    env,
    "/v1/checkout/sessions",
    {
      form,
      idempotencyKey: input.idempotencyKey,
      fetchImpl,
    },
  );
}

export type StripePortalFlow =
  | "manage"
  | "subscription_cancel"
  | "subscription_update"
  | "subscription_update_confirm";

export async function createStripePortalSession(
  env: Env,
  input: {
    stripeCustomerId: string;
    returnUrl: string;
    subscriptionId?: string | null;
    flow?: StripePortalFlow;
    /** Target price, required by the subscription_update_confirm flow. */
    priceId?: string | null;
    /** Item on the existing subscription that the target price replaces. */
    subscriptionItemId?: string | null;
  },
  fetchImpl?: typeof fetch,
): Promise<{ id: string; url: string }> {
  const form = new URLSearchParams({
    customer: input.stripeCustomerId,
    return_url: input.returnUrl,
  });
  const configurationId = env.STRIPE_PORTAL_CONFIGURATION_ID?.trim();
  if (configurationId) {
    form.set("configuration", configurationId);
  }
  if (input.flow && input.flow !== "manage") {
    const subscriptionId = input.subscriptionId?.trim();
    if (!subscriptionId) {
      throw new StripeBillingError(
        "No active subscription is available to change.",
        409,
        "subscription_not_found",
      );
    }
    form.set("flow_data[type]", input.flow);
    form.set(`flow_data[${input.flow}][subscription]`, subscriptionId);
    if (input.flow === "subscription_update_confirm") {
      const priceId = input.priceId?.trim();
      const itemId = input.subscriptionItemId?.trim();
      if (!priceId || !itemId) {
        throw new StripeBillingError(
          "The selected billing price is not configured.",
          503,
          "price_not_configured",
        );
      }
      form.set("flow_data[subscription_update_confirm][items][0][id]", itemId);
      form.set("flow_data[subscription_update_confirm][items][0][price]", priceId);
      form.set("flow_data[subscription_update_confirm][items][0][quantity]", "1");
    }
    form.set("flow_data[after_completion][type]", "redirect");
    form.set("flow_data[after_completion][redirect][return_url]", input.returnUrl);
  }
  return stripeApiRequest<{ id: string; url: string }>(
    env,
    "/v1/billing_portal/sessions",
    { form, fetchImpl },
  );
}

/**
 * Portal session for a customer who already pays for a plan.
 *
 * Prefers the confirm flow so the customer lands on the plan they actually
 * clicked instead of a second plan picker. Each flow is attempted in turn and
 * the plain portal is the last resort: the confirm and update flows both depend
 * on the portal configuration listing switchable products, and when that list is
 * empty Stripe rejects the session outright. Degrading to the portal home keeps
 * the customer in self-service instead of showing them a dead end.
 */
export async function createSubscriptionChangeSession(
  env: Env,
  input: {
    stripeCustomerId: string;
    subscriptionId: string;
    plan: PaidBillingPlan;
    interval: BillingInterval;
    /** Used only when the subscription's own currency cannot be resolved. */
    fallbackCurrency: BillingCurrency;
    returnUrl: string;
  },
  fetchImpl?: typeof fetch,
): Promise<{ id: string; url: string; flow: StripePortalFlow }> {
  let itemId: string | null = null;
  let currentPriceId: string | null = null;
  try {
    const subscription = await retrieveStripeSubscription(
      env,
      input.subscriptionId,
      fetchImpl,
    );
    const item = subscription.items?.data?.[0];
    itemId = item?.id?.trim() || null;
    currentPriceId = subscriptionPriceId(subscription);
  } catch (error) {
    console.warn(
      "[BILLING] Could not read subscription for plan change, falling back to the plan picker:",
      error,
    );
  }

  // Stripe cannot switch a subscription to another currency, so the target
  // price must match what the customer already pays in.
  const currency =
    billingCurrencyForStripePrice(env, currentPriceId) ?? input.fallbackCurrency;
  const targetPriceId = stripePriceIdFor(
    env,
    input.plan,
    input.interval,
    currency,
  );

  const flows: StripePortalFlow[] = [];
  if (itemId && targetPriceId && targetPriceId !== currentPriceId) {
    flows.push("subscription_update_confirm");
  }
  flows.push("subscription_update", "manage");

  let lastError: unknown = null;
  for (const flow of flows) {
    try {
      const session = await createStripePortalSession(
        env,
        {
          stripeCustomerId: input.stripeCustomerId,
          subscriptionId: input.subscriptionId,
          returnUrl: input.returnUrl,
          flow,
          priceId: targetPriceId,
          subscriptionItemId: itemId,
        },
        fetchImpl,
      );
      return { ...session, flow };
    } catch (error) {
      lastError = error;
      console.warn(`[BILLING] Portal ${flow} flow unavailable:`, error);
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new StripeBillingError(
        "The billing portal is unavailable.",
        502,
        "portal_unavailable",
      );
}

export type StripeBillingConfigHealth = {
  ok: boolean;
  apiVersion: string;
  secretConfigured: boolean;
  webhookSecretConfigured: boolean;
  prices: Array<{
    plan: PaidBillingPlan;
    interval: BillingInterval;
    id: string | null;
    expectedUnitAmount: number;
    actualUnitAmount: number | null;
    expectedCurrency: BillingCurrency;
    actualCurrency: string | null;
    configured: boolean;
    reachable: boolean;
    active: boolean | null;
    recurring: boolean | null;
    amountMatches: boolean | null;
    currencyMatches: boolean | null;
    error: string | null;
  }>;
  errors: string[];
};

export async function getStripeBillingConfigHealth(
  env: Env,
  fetchImpl?: typeof fetch,
): Promise<StripeBillingConfigHealth> {
  const definitions: Array<{
    plan: PaidBillingPlan;
    interval: BillingInterval;
    id: string | null;
    expectedUnitAmount: number;
    expectedCurrency: BillingCurrency;
  }> = (["personal_premium", "business_premium"] as const).flatMap((plan) =>
    (["usd", "eur"] as const).flatMap((currency) =>
      (["month", "year"] as const).map((interval) => ({
        plan,
        interval,
        id: stripePriceIdFor(env, plan, interval, currency),
        expectedUnitAmount: planPriceFor(plan, currency, interval) * 100,
        expectedCurrency: currency,
      })),
    ),
  );
  const errors: string[] = [];
  const ids = definitions.flatMap(({ id }) => id ? [id] : []);
  if (ids.length !== new Set(ids).size) {
    errors.push("Stripe price IDs must be unique across all eight regional billing options.");
  }
  if (!env.STRIPE_SECRET_KEY?.trim()) errors.push("STRIPE_SECRET_KEY is missing.");
  if (!env.STRIPE_WEBHOOK_SECRET?.trim()) errors.push("STRIPE_WEBHOOK_SECRET is missing.");

  const prices = await Promise.all(definitions.map(async (definition) => {
    if (!definition.id) {
      errors.push(
        `${definition.plan} ${definition.interval} ${definition.expectedCurrency.toUpperCase()} Stripe price is missing.`,
      );
      return {
        ...definition,
        configured: false,
        reachable: false,
        active: null,
        recurring: null,
        actualUnitAmount: null,
        actualCurrency: null,
        amountMatches: null,
        currencyMatches: null,
        error: "Price ID is not configured.",
      };
    }
    if (!env.STRIPE_SECRET_KEY?.trim()) {
      return {
        ...definition,
        configured: true,
        reachable: false,
        active: null,
        recurring: null,
        actualUnitAmount: null,
        actualCurrency: null,
        amountMatches: null,
        currencyMatches: null,
        error: "Stripe secret is not configured.",
      };
    }
    try {
      const remote = await stripeApiRequest<{
        id: string;
        active?: boolean;
        type?: string;
        unit_amount?: number | null;
        currency?: string | null;
        recurring?: { interval?: string } | null;
      }>(
        env,
        `/v1/prices/${encodeURIComponent(definition.id)}`,
        { fetchImpl },
      );
      const active = remote.active === true;
      const recurring = remote.type === "recurring" || Boolean(remote.recurring);
      const intervalMatches = remote.recurring?.interval === definition.interval;
      const actualUnitAmount =
        typeof remote.unit_amount === "number" &&
        Number.isInteger(remote.unit_amount)
          ? remote.unit_amount
          : null;
      const actualCurrency =
        typeof remote.currency === "string"
          ? remote.currency.trim().toLowerCase()
          : null;
      const amountMatches = actualUnitAmount === definition.expectedUnitAmount;
      const currencyMatches = actualCurrency === definition.expectedCurrency;
      const priceMatches =
        active &&
        recurring &&
        intervalMatches &&
        amountMatches &&
        currencyMatches;
      if (!priceMatches) {
        errors.push(
          `${definition.id} must be an active recurring ${definition.interval} price for ` +
          `${definition.expectedUnitAmount} ${definition.expectedCurrency.toUpperCase()} cents.`,
        );
      }
      return {
        ...definition,
        configured: true,
        reachable: true,
        active,
        recurring: recurring && intervalMatches,
        actualUnitAmount,
        actualCurrency,
        amountMatches,
        currencyMatches,
        error: priceMatches
          ? null
          : "Price is inactive or has the wrong interval, amount, or currency.",
      };
    } catch (error) {
      const failure = reconciliationError(error);
      errors.push(`${definition.id}: ${failure.message}`);
      return {
        ...definition,
        configured: true,
        reachable: false,
        active: null,
        recurring: null,
        actualUnitAmount: null,
        actualCurrency: null,
        amountMatches: null,
        currencyMatches: null,
        error: failure.message,
      };
    }
  }));

  return {
    ok: errors.length === 0,
    apiVersion: configuredStripeApiVersion(env),
    secretConfigured: Boolean(env.STRIPE_SECRET_KEY?.trim()),
    webhookSecretConfigured: Boolean(env.STRIPE_WEBHOOK_SECRET?.trim()),
    prices,
    errors,
  };
}

async function hmacSha256Hex(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(value)),
  );
  return Array.from(signature, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeHexEqual(left: string, right: string): boolean {
  if (left.length !== right.length || left.length % 2 !== 0) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export async function verifyStripeWebhookSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string,
  now = new Date(),
  toleranceSeconds = 300,
): Promise<boolean> {
  if (!signatureHeader || !secret) return false;
  let timestamp: number | null = null;
  const signatures: string[] = [];
  for (const part of signatureHeader.split(",")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key === "t" && /^\d+$/.test(value)) timestamp = Number(value);
    if (key === "v1" && /^[a-f0-9]{64}$/i.test(value)) signatures.push(value.toLowerCase());
  }
  if (timestamp == null || signatures.length === 0) return false;
  const age = Math.abs(Math.floor(now.getTime() / 1000) - timestamp);
  if (age > toleranceSeconds) return false;
  const expected = await hmacSha256Hex(secret, `${timestamp}.${payload}`);
  return signatures.some((signature) => timingSafeHexEqual(signature, expected));
}

async function findBillingUser(
  db: D1Database,
  input: {
    userId?: string | null;
    customerId?: string | null;
    subscriptionId?: string | null;
  },
): Promise<{
  id: string;
  account_type: string | null;
  plan: string | null;
  subscription_status: string | null;
  stripe_subscription_id: string | null;
  subscription_grace_period_end: string | null;
  subscription_last_event_created: number | null;
} | null> {
  const columns =
    "id, account_type, plan, subscription_status, stripe_subscription_id, subscription_grace_period_end, subscription_last_event_created";
  if (input.subscriptionId) {
    const row = await db.prepare(
      `SELECT ${columns} FROM users WHERE stripe_subscription_id = ? LIMIT 1`,
    ).bind(input.subscriptionId).first<{
      id: string;
      account_type: string | null;
      plan: string | null;
      subscription_status: string | null;
      stripe_subscription_id: string | null;
      subscription_grace_period_end: string | null;
      subscription_last_event_created: number | null;
    }>();
    if (row) return row;
  }
  if (input.customerId) {
    const row = await db.prepare(
      `SELECT ${columns} FROM users WHERE stripe_customer_id = ? LIMIT 1`,
    ).bind(input.customerId).first<{
      id: string;
      account_type: string | null;
      plan: string | null;
      subscription_status: string | null;
      stripe_subscription_id: string | null;
      subscription_grace_period_end: string | null;
      subscription_last_event_created: number | null;
    }>();
    if (row) return row;
  }
  if (input.userId) {
    return db.prepare(
      `SELECT ${columns} FROM users WHERE id = ? LIMIT 1`,
    ).bind(input.userId).first<{
      id: string;
      account_type: string | null;
      plan: string | null;
      subscription_status: string | null;
      stripe_subscription_id: string | null;
      subscription_grace_period_end: string | null;
      subscription_last_event_created: number | null;
    }>();
  }
  return null;
}

async function synchronizeSubscription(
  env: Env,
  subscription: StripeSubscription,
  eventCreated: number,
  gracePeriodEndOverride?: string | null,
  allowSubscriptionReplacement = false,
  authoritative = false,
): Promise<string | null> {
  if (!env.AUTH_DB) throw new StripeBillingError("Auth database not configured.", 503);
  const customerId = asId(subscription.customer);
  const subscriptionId = asId(subscription.id);
  const metadataUserId = subscription.metadata?.privatenote_user_id ?? null;
  const user = await findBillingUser(env.AUTH_DB, {
    userId: metadataUserId,
    customerId,
    subscriptionId,
  });
  if (!user || !subscriptionId) return null;
  if (
    user.stripe_subscription_id &&
    user.stripe_subscription_id !== subscriptionId &&
    !allowSubscriptionReplacement
  ) {
    return null;
  }

  const priceId = subscriptionPriceId(subscription);
  const plan = planForStripePrice(env, priceId);
  const status = subscription.status?.trim().toLowerCase() || "invalid";
  const terminal = TERMINAL_SUBSCRIPTION_STATUSES.has(status);
  const currentPeriodEnd =
    subscriptionPeriodEnd(subscription) ?? unixSecondsToIso(subscription.ended_at);
  const gracePeriodEnd =
    gracePeriodEndOverride !== undefined
      ? gracePeriodEndOverride
      : status === "active" || status === "trialing" || status === "canceled"
        ? null
        : user.subscription_grace_period_end;
  // Unknown prices fail closed for paid access, but terminal events retain the
  // last configured plan so the account can show what expired and resubscribe.
  const configuredPlan = plan ?? (terminal
    ? (user.account_type === "business_premium" || user.account_type === "personal_premium"
      ? user.account_type
      : "free")
    : "free");
  const linkedSubscriptionId = terminal ? null : subscriptionId;

  const values = [
    configuredPlan,
    configuredPlan,
    status,
    currentPeriodEnd,
    gracePeriodEnd,
    customerId,
    linkedSubscriptionId,
    priceId,
    subscriptionCancelsAtPeriodEnd(subscription) ? 1 : 0,
  ];
  let updateChanges = 0;
  if (authoritative) {
    const update = await env.AUTH_DB.prepare(
      `UPDATE users
       SET account_type = ?,
           plan = ?,
           subscription_status = ?,
           subscription_current_period_end = ?,
           subscription_grace_period_end = ?,
           stripe_customer_id = COALESCE(?, stripe_customer_id),
           stripe_subscription_id = ?,
           stripe_price_id = ?,
           subscription_cancel_at_period_end = ?,
           subscription_updated_at = datetime('now'),
           updated_at = datetime('now')
       WHERE id = ?`,
    ).bind(...values, user.id).run();
    updateChanges = update.meta?.changes ?? 0;
  } else {
    const update = await env.AUTH_DB.prepare(
      `UPDATE users
       SET account_type = ?,
           plan = ?,
           subscription_status = ?,
           subscription_current_period_end = ?,
           subscription_grace_period_end = ?,
           stripe_customer_id = COALESCE(?, stripe_customer_id),
           stripe_subscription_id = ?,
           stripe_price_id = ?,
           subscription_cancel_at_period_end = ?,
           subscription_updated_at = datetime('now'),
           subscription_last_event_created = ?,
           updated_at = datetime('now')
       WHERE id = ?
         AND (
           subscription_last_event_created IS NULL
           OR subscription_last_event_created <= ?
         )`,
    ).bind(...values, eventCreated, user.id, eventCreated).run();
    updateChanges = update.meta?.changes ?? 0;
  }
  return updateChanges > 0 ? user.id : null;
}

function unknownPriceError(subscription: StripeSubscription): StripeBillingError {
  const priceId = subscriptionPriceId(subscription);
  return priceId
    ? new StripeBillingError(
        `Stripe subscription ${subscription.id} uses unconfigured price ${priceId}.`,
        500,
        "unknown_stripe_price",
      )
    : new StripeBillingError(
        `Stripe subscription ${subscription.id} has no recognizable price.`,
        500,
        "missing_stripe_price",
      );
}

function invoiceNextPaymentAttempt(invoice: Record<string, unknown>): number | null {
  const value = invoice.next_payment_attempt;
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : null;
}

function invoiceAttemptCount(invoice: Record<string, unknown>): number {
  const value = invoice.attempt_count;
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

function invoiceGracePeriodEnd(
  env: Env,
  invoice: Record<string, unknown>,
  eventCreated: number,
): string {
  const fixedDeadline = eventCreated + configuredGraceDays(env) * 24 * 60 * 60;
  const nextAttempt = invoiceNextPaymentAttempt(invoice);
  // Keep access through the next scheduled collection attempt and a one-day
  // processing buffer. Repeated failed/updated invoice events move this forward.
  const retryDeadline = nextAttempt ? nextAttempt + 24 * 60 * 60 : 0;
  return new Date(Math.max(fixedDeadline, retryDeadline) * 1000).toISOString();
}

function invoiceSubscriptionId(invoice: Record<string, unknown>): string | null {
  const direct = asId(invoice.subscription);
  if (direct) return direct;
  const parent = invoice.parent;
  if (parent && typeof parent === "object") {
    const details = (parent as { subscription_details?: unknown }).subscription_details;
    if (details && typeof details === "object") {
      return asId((details as { subscription?: unknown }).subscription);
    }
  }
  return null;
}

async function retrieveStripeSubscription(
  env: Env,
  subscriptionId: string,
  fetchImpl?: typeof fetch,
): Promise<StripeSubscription> {
  return stripeApiRequest<StripeSubscription>(
    env,
    `/v1/subscriptions/${encodeURIComponent(subscriptionId)}`,
    { fetchImpl },
  );
}

async function claimStripeWebhookEvent(
  db: D1Database,
  event: StripeEvent,
): Promise<boolean> {
  const inserted = await db.prepare(
    `INSERT OR IGNORE INTO billing_webhook_events
       (event_id, event_type, event_created, processed_at, processing_status, attempts)
     VALUES (?, ?, ?, datetime('now'), 'processing', 1)`,
  ).bind(event.id, event.type, event.created).run();
  if ((inserted.meta?.changes ?? 0) > 0) return true;

  const reclaimed = await db.prepare(
    `UPDATE billing_webhook_events
     SET processing_status = 'processing',
         attempts = attempts + 1,
         processed_at = datetime('now'),
         error_code = NULL,
         error_message = NULL
     WHERE event_id = ?
       AND attempts < ?
       AND (
         processing_status = 'failed'
         OR (
           processing_status = 'processing'
           AND processed_at < datetime('now', '-15 minutes')
         )
       )`,
  ).bind(event.id, MAX_WEBHOOK_PROCESSING_ATTEMPTS).run();
  if ((reclaimed.meta?.changes ?? 0) > 0) return true;

  await db.prepare(
    `UPDATE billing_webhook_events
     SET processing_status = 'dead_letter',
         processed_at = datetime('now'),
         error_code = 'webhook_attempts_exhausted',
         error_message = 'Webhook processing attempts were exhausted; manual investigation is required.'
     WHERE event_id = ?
       AND attempts >= ?
       AND (
         processing_status = 'failed'
         OR (
           processing_status = 'processing'
           AND processed_at < datetime('now', '-15 minutes')
         )
       )`,
  ).bind(event.id, MAX_WEBHOOK_PROCESSING_ATTEMPTS).run();
  const current = await db.prepare(
    `SELECT processing_status
     FROM billing_webhook_events
     WHERE event_id = ?
     LIMIT 1`,
  ).bind(event.id).first<{ processing_status: string }>();
  if (current?.processing_status === "processing") {
    throw new StripeBillingError(
      "This Stripe event is already being processed; retry it later.",
      409,
      "webhook_processing_in_progress",
    );
  }
  return false;
}

async function completeStripeWebhookEvent(
  db: D1Database,
  eventId: string,
  userId: string | null,
  warning?: StripeBillingError | null,
): Promise<void> {
  await db.prepare(
    `UPDATE billing_webhook_events
     SET processing_status = ?,
         processed_at = datetime('now'),
         user_id = ?,
         error_code = ?,
         error_message = ?
     WHERE event_id = ?`,
  ).bind(
    warning ? "processed_with_error" : "processed",
    userId,
    warning?.code ?? null,
    warning?.message ?? null,
    eventId,
  ).run();
}

async function failStripeWebhookEvent(
  db: D1Database,
  eventId: string,
  error: unknown,
): Promise<void> {
  const failure = reconciliationError(error);
  await db.prepare(
    `UPDATE billing_webhook_events
     SET processing_status = 'failed',
         processed_at = datetime('now'),
         error_code = ?,
         error_message = ?
     WHERE event_id = ?`,
  ).bind(failure.code, failure.message, eventId).run();
}

export async function processStripeWebhookEvent(
  env: Env,
  event: StripeEvent,
  fetchImpl?: typeof fetch,
): Promise<{
  duplicate: boolean;
  handled: boolean;
  userId: string | null;
  warning?: { code: string; message: string };
}> {
  if (!env.AUTH_DB) throw new StripeBillingError("Auth database not configured.", 503);
  if (!event.id || !event.type || !Number.isInteger(event.created)) {
    throw new StripeBillingError("Invalid Stripe event.", 400, "invalid_event");
  }
  const claimed = await claimStripeWebhookEvent(env.AUTH_DB, event);
  if (!claimed) return { duplicate: true, handled: true, userId: null };

  let handled = false;
  let userId: string | null = null;
  let warning: StripeBillingError | null = null;
  const object = event.data?.object ?? {};

  try {
    if (event.type.startsWith("customer.subscription.")) {
      const subscription = object as unknown as StripeSubscription;
      userId = await synchronizeSubscription(
        env,
        subscription,
        event.created,
        undefined,
        event.type === "customer.subscription.created",
      );
      if (!planForStripePrice(env, subscriptionPriceId(subscription))) {
        warning = unknownPriceError(subscription);
        console.error(`[BILLING] ${warning.code}: ${warning.message}`);
      }
      if (userId) {
        try {
          if (event.type === "customer.subscription.trial_will_end") {
            const trialEnd =
              unixSecondsToIso(subscription.trial_end) ?? subscriptionPeriodEnd(subscription);
            await queueBillingNotification(env, {
              key: `trial_ending:${subscription.id}:${trialEnd ?? event.created}`,
              userId,
              subscriptionId: subscription.id,
              type: "trial_ending",
              effectiveAt: trialEnd,
            });
          } else if (
            event.type === "customer.subscription.deleted" ||
            subscriptionCancelsAtPeriodEnd(subscription)
          ) {
            // Stripe's own cancellation date wins over the period end: the two
            // normally match, but a cancellation scheduled for a specific date
            // would otherwise be announced for the wrong day.
            const effectiveAt =
              event.type === "customer.subscription.deleted"
                ? null
                : unixSecondsToIso(subscription.cancel_at) ??
                  subscriptionPeriodEnd(subscription);
            await queueBillingNotification(env, {
              key: `cancellation_confirmed:${subscription.id}:${effectiveAt ?? "immediate"}`,
              userId,
              subscriptionId: subscription.id,
              type: "cancellation_confirmed",
              effectiveAt,
            });
          }
        } catch (error) {
          console.error("[BILLING] Could not queue subscription communication:", error);
        }
      }
      handled = true;
    } else if (event.type === "checkout.session.completed") {
      const subscriptionId = asId(object.subscription);
      if (subscriptionId) {
        const subscription = await retrieveStripeSubscription(env, subscriptionId, fetchImpl);
        subscription.metadata = {
          ...(subscription.metadata ?? {}),
          privatenote_user_id:
            subscription.metadata?.privatenote_user_id ??
            (typeof object.client_reference_id === "string"
              ? object.client_reference_id
              : undefined),
        };
        userId = await synchronizeSubscription(
          env,
          subscription,
          event.created,
          undefined,
          true,
        );
        if (!planForStripePrice(env, subscriptionPriceId(subscription))) {
          warning = unknownPriceError(subscription);
          console.error(`[BILLING] ${warning.code}: ${warning.message}`);
        }
      }
      handled = true;
    } else if (event.type === "invoice.created") {
      const invoiceId = asId(object.id);
      const status = typeof object.status === "string" ? object.status : "";
      const existingFooter =
        typeof object.footer === "string" ? object.footer.trim() : "";
      if (invoiceId && status === "draft" && !existingFooter) {
        try {
          await applyInvoiceVatFooter(env, invoiceId, fetchImpl);
        } catch (error) {
          // First subscription invoices often finalize immediately; Dashboard
          // default footer covers that race. Renewal drafts stay editable.
          console.error("[BILLING] Could not set VAT franchise invoice footer:", error);
        }
      }
      handled = true;
    } else if (
      event.type === "invoice.payment_failed" ||
      event.type === "invoice.paid" ||
      (
        event.type === "invoice.updated" &&
        invoiceNextPaymentAttempt(object) !== null &&
        invoiceAttemptCount(object) > 0
      )
    ) {
      const subscriptionId = invoiceSubscriptionId(object);
      if (subscriptionId) {
        const subscription = await retrieveStripeSubscription(env, subscriptionId, fetchImpl);
        const retryEvent =
          event.type === "invoice.payment_failed" || event.type === "invoice.updated";
        const subscriptionStatus =
          subscription.status?.trim().toLowerCase() ?? "invalid";
        const graceEligible =
          retryEvent && ["past_due", "unpaid"].includes(subscriptionStatus);
        const gracePeriodEnd = graceEligible
          ? invoiceGracePeriodEnd(env, object, event.created)
          : null;
        userId = await synchronizeSubscription(
          env,
          subscription,
          event.created,
          gracePeriodEnd,
        );
        if (!planForStripePrice(env, subscriptionPriceId(subscription))) {
          warning = unknownPriceError(subscription);
          console.error(`[BILLING] ${warning.code}: ${warning.message}`);
        }
        if (userId && event.type === "invoice.payment_failed") {
          try {
            await queueBillingNotification(env, {
              key: `payment_failed:${event.id}`,
              userId,
              subscriptionId,
              type: "payment_failed",
              effectiveAt: gracePeriodEnd,
            });
          } catch (error) {
            console.error("[BILLING] Could not queue payment-failure communication:", error);
          }
        }
      }
      handled = true;
    }
    await completeStripeWebhookEvent(env.AUTH_DB, event.id, userId, warning);
  } catch (error) {
    await failStripeWebhookEvent(env.AUTH_DB, event.id, error);
    throw error;
  }

  return {
    duplicate: false,
    handled,
    userId,
    ...(warning ? { warning: { code: warning.code, message: warning.message } } : {}),
  };
}

type ReconciliationCandidate = {
  id: string;
  account_type: string | null;
  plan: string | null;
  subscription_status: string | null;
  subscription_current_period_end: string | null;
  subscription_grace_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string;
  stripe_price_id: string | null;
  subscription_cancel_at_period_end: number | null;
};

export type StripeReconciliationResult = {
  runId: string | null;
  status: "skipped" | "completed" | "partial" | "failed";
  scanned: number;
  repaired: number;
  unchanged: number;
  failed: number;
};

function reconciliationLimit(env: Env): number {
  const parsed = Number(env.STRIPE_RECONCILIATION_LIMIT ?? "100");
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 500 ? parsed : 100;
}

function reconciliationError(error: unknown): {
  code: string;
  message: string;
} {
  const billingError = error instanceof StripeBillingError ? error : null;
  return {
    code: billingError?.code ?? "reconciliation_failed",
    message: (error instanceof Error ? error.message : String(error)).slice(0, 500),
  };
}

function subscriptionDiffers(
  env: Env,
  local: ReconciliationCandidate,
  remote: StripeSubscription,
): boolean {
  const priceId = subscriptionPriceId(remote);
  const plan = planForStripePrice(env, priceId) ?? "free";
  const status = remote.status?.trim().toLowerCase() || "invalid";
  const expectedSubscriptionId = TERMINAL_SUBSCRIPTION_STATUSES.has(status)
    ? null
    : remote.id;
  const periodEnd =
    subscriptionPeriodEnd(remote) ?? unixSecondsToIso(remote.ended_at);
  const customerId = asId(remote.customer);
  const gracePeriodEnd =
    status === "active" || status === "trialing" || status === "canceled"
      ? null
      : local.subscription_grace_period_end;

  return (
    local.account_type !== plan ||
    local.plan !== plan ||
    local.subscription_status !== status ||
    local.subscription_current_period_end !== periodEnd ||
    local.subscription_grace_period_end !== gracePeriodEnd ||
    (customerId !== null && local.stripe_customer_id !== customerId) ||
    local.stripe_subscription_id !== expectedSubscriptionId ||
    local.stripe_price_id !== priceId ||
    (local.subscription_cancel_at_period_end === 1) !==
      subscriptionCancelsAtPeriodEnd(remote)
  );
}

async function recordReconciliationFailure(
  db: D1Database,
  input: {
    runId: string;
    userId: string | null;
    subscriptionId: string | null;
    error: unknown;
    reconciledAt?: string;
  },
): Promise<void> {
  const failure = reconciliationError(input.error);
  if (input.userId && input.reconciledAt) {
    await db.prepare(
      `UPDATE users
       SET subscription_last_reconciled_at = ?,
           subscription_reconciliation_error = ?
       WHERE id = ?`,
    ).bind(
      input.reconciledAt,
      `${failure.code}: ${failure.message}`,
      input.userId,
    ).run();
  }
  await db.prepare(
    `INSERT INTO billing_reconciliation_failures
       (id, run_id, user_id, stripe_subscription_id, error_code, error_message)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(
    crypto.randomUUID(),
    input.runId,
    input.userId,
    input.subscriptionId,
    failure.code,
    failure.message,
  ).run();
}

async function reconcileUnlinkedStripeSubscriptions(
  env: Env,
  input: {
    db: D1Database;
    runId: string;
    now: Date;
    remaining: number;
    fetchImpl?: typeof fetch;
    result: StripeReconciliationResult;
  },
): Promise<void> {
  if (input.remaining <= 0) return;
  const cursor = await input.db.prepare(
    "SELECT value FROM billing_reconciliation_state WHERE key = ? LIMIT 1",
  ).bind(ORPHAN_RECONCILIATION_CURSOR_KEY).first<{ value: string }>();
  let statusIndex = 0;
  let startingAfter: string | null = null;
  if (cursor?.value) {
    try {
      const parsed = JSON.parse(cursor.value) as {
        statusIndex?: unknown;
        startingAfter?: unknown;
      };
      if (
        typeof parsed.statusIndex === "number" &&
        Number.isInteger(parsed.statusIndex) &&
        parsed.statusIndex >= 0 &&
        parsed.statusIndex < ORPHAN_DISCOVERY_STATUSES.length
      ) {
        statusIndex = parsed.statusIndex;
      }
      if (typeof parsed.startingAfter === "string" && parsed.startingAfter) {
        startingAfter = parsed.startingAfter;
      }
    } catch {
      // Compatibility with the original cursor format, which stored only an ID.
      startingAfter = cursor.value;
    }
  }
  const discoveryStatus = ORPHAN_DISCOVERY_STATUSES[statusIndex];
  const query = new URLSearchParams({
    status: discoveryStatus,
    limit: String(Math.min(100, input.remaining)),
  });
  if (startingAfter) query.set("starting_after", startingAfter);
  const page = await stripeApiRequest<StripeSubscriptionList>(
    env,
    `/v1/subscriptions?${query.toString()}`,
    { fetchImpl: input.fetchImpl },
  );
  const subscriptions = page.data ?? [];

  for (const subscription of subscriptions) {
    if (TERMINAL_SUBSCRIPTION_STATUSES.has(
      subscription.status?.trim().toLowerCase() ?? "",
    )) {
      continue;
    }
    const metadataUserId = subscription.metadata?.privatenote_user_id ?? null;
    if (!metadataUserId) continue;
    const owner = await findBillingUser(input.db, { userId: metadataUserId });
    if (!owner || owner.stripe_subscription_id) continue;

    input.result.scanned += 1;
    try {
      const userId = await synchronizeSubscription(
        env,
        subscription,
        Math.floor(input.now.getTime() / 1000),
        undefined,
        false,
        true,
      );
      if (userId !== owner.id) {
        throw new StripeBillingError(
          "Discovered Stripe subscription could not be linked to its metadata owner.",
          409,
          "subscription_owner_mismatch",
        );
      }
      if (!planForStripePrice(env, subscriptionPriceId(subscription))) {
        throw unknownPriceError(subscription);
      }
      await input.db.prepare(
        `UPDATE users
         SET subscription_last_reconciled_at = ?,
             subscription_reconciliation_error = NULL
         WHERE id = ?`,
      ).bind(input.now.toISOString(), owner.id).run();
      input.result.repaired += 1;
    } catch (error) {
      input.result.failed += 1;
      await recordReconciliationFailure(input.db, {
        runId: input.runId,
        userId: owner.id,
        subscriptionId: subscription.id,
        error,
        reconciledAt: input.now.toISOString(),
      });
    }
  }

  const lastId = subscriptions.at(-1)?.id ?? null;
  const nextCursor = page.has_more && lastId
    ? { statusIndex, startingAfter: lastId }
    : {
        statusIndex: (statusIndex + 1) % ORPHAN_DISCOVERY_STATUSES.length,
        startingAfter: null,
      };
  await input.db.prepare(
    `INSERT INTO billing_reconciliation_state (key, value, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  ).bind(
    ORPHAN_RECONCILIATION_CURSOR_KEY,
    JSON.stringify(nextCursor),
  ).run();
}

/**
 * Repairs local billing state from Stripe's authoritative subscription object.
 *
 * Accounts are selected least-recently reconciled first. A reconciliation sync
 * deliberately does not advance subscription_last_event_created: a recovery
 * run must not make legitimate, later-arriving webhook events look stale.
 */
export async function reconcileStripeSubscriptions(
  env: Env,
  options: {
    fetchImpl?: typeof fetch;
    now?: Date;
    runId?: string;
  } = {},
): Promise<StripeReconciliationResult> {
  if (!env.AUTH_DB || !env.STRIPE_SECRET_KEY?.trim()) {
    return {
      runId: null,
      status: "skipped",
      scanned: 0,
      repaired: 0,
      unchanged: 0,
      failed: 0,
    };
  }

  const db = env.AUTH_DB;
  const now = options.now ?? new Date();
  const startedAt = now.toISOString();
  const runId = options.runId ?? crypto.randomUUID();
  const result: StripeReconciliationResult = {
    runId,
    status: "completed",
    scanned: 0,
    repaired: 0,
    unchanged: 0,
    failed: 0,
  };

  await db.prepare(
    `INSERT INTO billing_reconciliation_runs
       (id, started_at, status)
     VALUES (?, ?, 'running')`,
  ).bind(runId, startedAt).run();

  try {
    const limit = reconciliationLimit(env);
    // Always reserve part of each run for discovering subscriptions whose
    // linking webhooks never committed locally.
    const linkedCandidateLimit = Math.max(1, Math.floor(limit * 0.8));
    const discoveryBudget = Math.max(1, limit - linkedCandidateLimit);
    const candidates = await db.prepare(
      `SELECT
         id,
         account_type,
         plan,
         subscription_status,
         subscription_current_period_end,
         subscription_grace_period_end,
         stripe_customer_id,
         stripe_subscription_id,
         stripe_price_id,
         subscription_cancel_at_period_end
       FROM users
       WHERE stripe_subscription_id IS NOT NULL
         AND stripe_subscription_id <> ''
       ORDER BY
         subscription_last_reconciled_at IS NOT NULL,
         subscription_last_reconciled_at,
         id
       LIMIT ?`,
    ).bind(linkedCandidateLimit).all<ReconciliationCandidate>();

    for (const candidate of candidates.results ?? []) {
      result.scanned += 1;
      try {
        const subscription = await retrieveStripeSubscription(
          env,
          candidate.stripe_subscription_id,
          options.fetchImpl,
        );
        const repaired = subscriptionDiffers(env, candidate, subscription);
        const userId = await synchronizeSubscription(
          env,
          subscription,
          Math.floor(now.getTime() / 1000),
          undefined,
          false,
          true,
        );
        if (userId !== candidate.id) {
          throw new StripeBillingError(
            "Stripe subscription could not be matched to its local account.",
            409,
            "subscription_owner_mismatch",
          );
        }
        if (!planForStripePrice(env, subscriptionPriceId(subscription))) {
          throw unknownPriceError(subscription);
        }
        await db.prepare(
          `UPDATE users
           SET subscription_last_reconciled_at = ?,
               subscription_reconciliation_error = NULL
           WHERE id = ?`,
        ).bind(startedAt, candidate.id).run();
        if (repaired) result.repaired += 1;
        else result.unchanged += 1;
      } catch (error) {
        result.failed += 1;
        await recordReconciliationFailure(db, {
          runId,
          userId: candidate.id,
          subscriptionId: candidate.stripe_subscription_id,
          error,
          reconciledAt: startedAt,
        });
      }
    }

    await reconcileUnlinkedStripeSubscriptions(env, {
      db,
      runId,
      now,
      remaining: Math.max(discoveryBudget, limit - result.scanned),
      fetchImpl: options.fetchImpl,
      result,
    });

    result.status = result.failed > 0 ? "partial" : "completed";
    await db.prepare(
      `UPDATE billing_reconciliation_runs
       SET finished_at = ?,
           status = ?,
           scanned_count = ?,
           repaired_count = ?,
           unchanged_count = ?,
           failed_count = ?
       WHERE id = ?`,
    ).bind(
      new Date().toISOString(),
      result.status,
      result.scanned,
      result.repaired,
      result.unchanged,
      result.failed,
      runId,
    ).run();
    return result;
  } catch (error) {
    result.status = "failed";
    const failure = reconciliationError(error);
    await db.prepare(
      `UPDATE billing_reconciliation_runs
       SET finished_at = ?,
           status = 'failed',
           scanned_count = ?,
           repaired_count = ?,
           unchanged_count = ?,
           failed_count = ?,
           error_message = ?
       WHERE id = ?`,
    ).bind(
      new Date().toISOString(),
      result.scanned,
      result.repaired,
      result.unchanged,
      result.failed,
      failure.message,
      runId,
    ).run();
    return result;
  }
}

export type BillingRetentionResult = {
  webhookEvents: number;
  reconciliationRuns: number;
  reconciliationFailures: number;
  customerNotifications: number;
  error?: string;
};

/**
 * Keeps billing operations useful for support without retaining delivery and
 * reconciliation records forever. Active/pending notifications are preserved.
 */
export async function cleanupBillingOperationalHistory(
  env: Env,
  now = new Date(),
): Promise<BillingRetentionResult> {
  const result: BillingRetentionResult = {
    webhookEvents: 0,
    reconciliationRuns: 0,
    reconciliationFailures: 0,
    customerNotifications: 0,
  };
  if (!env.AUTH_DB) return { ...result, error: "AUTH_DB not configured" };
  const daysAgo = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  try {
    const webhookDelete = await env.AUTH_DB.prepare(
      `DELETE FROM billing_webhook_events
       WHERE processed_at < ?
         AND processing_status IN ('processed', 'processed_with_error', 'dead_letter')`,
    ).bind(daysAgo(90)).run();
    result.webhookEvents = webhookDelete.meta?.changes ?? 0;

    const failureDelete = await env.AUTH_DB.prepare(
      `DELETE FROM billing_reconciliation_failures
       WHERE run_id IN (
         SELECT id FROM billing_reconciliation_runs WHERE started_at < ?
       )`,
    ).bind(daysAgo(180)).run();
    result.reconciliationFailures = failureDelete.meta?.changes ?? 0;

    const runDelete = await env.AUTH_DB.prepare(
      "DELETE FROM billing_reconciliation_runs WHERE started_at < ?",
    ).bind(daysAgo(180)).run();
    result.reconciliationRuns = runDelete.meta?.changes ?? 0;

    const notificationDelete = await env.AUTH_DB.prepare(
      `DELETE FROM billing_customer_notifications
       WHERE created_at < ?
         AND status IN ('sent', 'failed', 'skipped')`,
    ).bind(daysAgo(365)).run();
    result.customerNotifications = notificationDelete.meta?.changes ?? 0;
    return result;
  } catch (error) {
    return {
      ...result,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
