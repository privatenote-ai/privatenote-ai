import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveAccountEntitlements } from "./accountEntitlements";

const NOW = new Date("2026-07-28T12:00:00.000Z");

describe("resolveAccountEntitlements", () => {
  it("does not grant paid access from account_type alone", () => {
    const result = resolveAccountEntitlements(
      { accountType: "personal_premium" },
      NOW,
    );
    assert.equal(result.accountType, "free");
    assert.equal(result.state, "invalid");
    assert.equal(result.capabilities.maxExpirySeconds, 3 * 24 * 60 * 60);
  });

  it("grants active and trialing subscriptions through their period end", () => {
    for (const subscriptionStatus of ["active", "trialing"]) {
      const result = resolveAccountEntitlements(
        {
          accountType: "personal_premium",
          subscriptionStatus,
          subscriptionCurrentPeriodEnd: "2026-08-28T12:00:00.000Z",
        },
        NOW,
      );
      assert.equal(result.accountType, "personal_premium");
      assert.equal(result.state, subscriptionStatus);
      assert.equal(result.capabilities.recipientVerification, true);
    }
  });

  it("fails closed at the exact period-end boundary", () => {
    const result = resolveAccountEntitlements(
      {
        accountType: "business_premium",
        subscriptionStatus: "active",
        subscriptionCurrentPeriodEnd: NOW.toISOString(),
      },
      NOW,
    );
    assert.equal(result.accountType, "free");
    assert.equal(result.state, "expired");
    assert.equal(result.capabilities.revealBranding, false);
  });

  it("honors an explicit future grace period after payment failure", () => {
    const result = resolveAccountEntitlements(
      {
        accountType: "business_premium",
        subscriptionStatus: "past_due",
        subscriptionCurrentPeriodEnd: "2026-07-27T12:00:00.000Z",
        subscriptionGracePeriodEnd: "2026-07-31T12:00:00.000Z",
      },
      NOW,
    );
    assert.equal(result.accountType, "business_premium");
    assert.equal(result.state, "grace");
    assert.equal(result.capabilities.revealBranding, true);
  });

  it("downgrades without deleting the configured paid plan", () => {
    const result = resolveAccountEntitlements(
      {
        accountType: "personal_premium",
        subscriptionStatus: "canceled",
        subscriptionCurrentPeriodEnd: "2026-07-27T12:00:00.000Z",
      },
      NOW,
    );
    assert.equal(result.configuredAccountType, "personal_premium");
    assert.equal(result.accountType, "free");
    assert.equal(result.state, "expired");
    assert.equal(result.capabilities.savedDefaults, false);
  });

  it("supports explicit time-limited manual grants for migrated accounts", () => {
    const active = resolveAccountEntitlements(
      {
        accountType: "business_premium",
        manualEntitlementExpiresAt: "2026-08-28T12:00:00.000Z",
      },
      NOW,
    );
    assert.equal(active.accountType, "business_premium");
    assert.equal(active.state, "manual");

    const expired = resolveAccountEntitlements(
      {
        accountType: "business_premium",
        manualEntitlementExpiresAt: NOW.toISOString(),
      },
      NOW,
    );
    assert.equal(expired.accountType, "free");
    assert.equal(expired.state, "invalid");
  });

  it("keeps a temporary override plan separate from the Stripe plan", () => {
    const during = resolveAccountEntitlements(
      {
        accountType: "personal_premium",
        plan: "personal_premium",
        subscriptionStatus: "active",
        subscriptionCurrentPeriodEnd: "2026-09-01T00:00:00.000Z",
        manualEntitlementAccountType: "business_premium",
        manualEntitlementExpiresAt: "2026-08-02T00:00:00.000Z",
      },
      NOW,
    );
    assert.equal(during.accountType, "business_premium");
    assert.equal(during.configuredAccountType, "personal_premium");
    assert.equal(during.state, "manual");

    const after = resolveAccountEntitlements(
      {
        accountType: "personal_premium",
        plan: "personal_premium",
        subscriptionStatus: "active",
        subscriptionCurrentPeriodEnd: "2026-09-01T00:00:00.000Z",
        manualEntitlementAccountType: "business_premium",
        manualEntitlementExpiresAt: "2026-07-27T00:00:00.000Z",
      },
      NOW,
    );
    assert.equal(after.accountType, "personal_premium");
    assert.equal(after.state, "active");
  });
});
