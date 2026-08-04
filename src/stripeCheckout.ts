/**
 * Minimal Stripe Checkout + Billing Portal helpers for the premium/staging branch.
 * Full webhook entitlement sync lives on main (`src/stripeBilling.ts`); this module
 * only starts Checkout Sessions and Customer Portal so pricing CTAs can open payment.
 */
import { BILLING_TERMS_VERSION } from "@shared/billingTerms";
import type { AccountType, BillingCurrency } from "@shared/planCatalog";
import type { Env } from "./types";

export type PaidBillingPlan = Exclude<AccountType, "free">;
export type BillingInterval = "month" | "year";

const DEFAULT_STRIPE_API_VERSION = "2025-03-31.basil";

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

export function checkoutIdempotencyKey(
  userId: string,
  plan: PaidBillingPlan,
  interval: BillingInterval,
  now: Date,
  currency: BillingCurrency,
): string {
  const fiveMinuteBucket = Math.floor(now.getTime() / (5 * 60 * 1000));
  return `checkout-${userId}-${plan}-${interval}-${currency}-${fiveMinuteBucket}`;
}

async function stripeApiRequest<T>(
  env: Env,
  path: string,
  options: {
    form: URLSearchParams;
    idempotencyKey?: string;
    fetchImpl?: typeof fetch;
  },
): Promise<T> {
  const secret = env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    throw new StripeBillingError("Stripe is not configured.", 503, "stripe_not_configured");
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": env.STRIPE_API_VERSION?.trim() || DEFAULT_STRIPE_API_VERSION,
      ...(options.idempotencyKey
        ? { "Idempotency-Key": options.idempotencyKey }
        : {}),
    },
    body: options.form.toString(),
  });
  const body = (await response.json()) as T & StripeApiErrorBody;
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
  const priceId = stripePriceIdFor(env, input.plan, input.interval, input.currency);
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
  return stripeApiRequest<{ id: string; url: string }>(env, "/v1/checkout/sessions", {
    form,
    idempotencyKey: input.idempotencyKey,
    fetchImpl,
  });
}

export async function createStripePortalSession(
  env: Env,
  input: {
    stripeCustomerId: string;
    returnUrl: string;
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
  return stripeApiRequest<{ id: string; url: string }>(env, "/v1/billing_portal/sessions", {
    form,
    fetchImpl,
  });
}
