import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { stripeSubscriptionEntitlesPremium } from "./routes/auth.ts";

describe("Stripe billing entitlements", () => {
  const now = Date.parse("2026-06-12T12:00:00.000Z");

  it("grants Premium for active and trialing subscriptions", () => {
    assert.equal(stripeSubscriptionEntitlesPremium("active", null, now), true);
    assert.equal(stripeSubscriptionEntitlesPremium("trialing", null, now), true);
  });

  it("keeps Premium during the past-due grace window", () => {
    assert.equal(
      stripeSubscriptionEntitlesPremium("past_due", "2026-06-10T12:00:00.000Z", now),
      true,
    );
  });

  it("downgrades after grace or terminal subscription states", () => {
    assert.equal(
      stripeSubscriptionEntitlesPremium("past_due", "2026-06-08T11:59:00.000Z", now),
      false,
    );
    assert.equal(stripeSubscriptionEntitlesPremium("canceled", "2026-07-01T00:00:00.000Z", now), false);
    assert.equal(stripeSubscriptionEntitlesPremium("unpaid", "2026-07-01T00:00:00.000Z", now), false);
    assert.equal(stripeSubscriptionEntitlesPremium("incomplete_expired", null, now), false);
  });
});
