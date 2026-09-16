import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canCancelSubscription,
  canManageBilling,
} from "./billingPortalAccess";

describe("billing portal access", () => {
  it("exposes manage billing for a Stripe customer or a paid plan", () => {
    assert.equal(canManageBilling({ stripeCustomerLinked: true, accountType: "free" }), true);
    assert.equal(
      canManageBilling({ stripeCustomerLinked: false, accountType: "personal_premium" }),
      true,
    );
    assert.equal(
      canManageBilling({ stripeCustomerLinked: false, accountType: "business_premium" }),
      true,
    );
    assert.equal(canManageBilling({ stripeCustomerLinked: false, accountType: "free" }), false);
  });

  it("exposes cancel for live Stripe subscriptions, including paid plans with unknown status", () => {
    assert.equal(
      canCancelSubscription({
        canManage: true,
        subscriptionStatus: "active",
        subscriptionLinked: true,
      }),
      true,
    );
    assert.equal(
      canCancelSubscription({
        canManage: true,
        subscriptionState: "grace",
      }),
      true,
    );
    assert.equal(canCancelSubscription({ canManage: true }), true);
    assert.equal(
      canCancelSubscription({
        canManage: true,
        subscriptionState: "manual",
      }),
      false,
    );
    assert.equal(
      canCancelSubscription({
        canManage: true,
        subscriptionLinked: false,
      }),
      false,
    );
    assert.equal(
      canCancelSubscription({
        canManage: true,
        cancelAtPeriodEnd: true,
        subscriptionStatus: "active",
      }),
      false,
    );
    assert.equal(
      canCancelSubscription({
        canManage: true,
        subscriptionStatus: "canceled",
      }),
      false,
    );
    assert.equal(canCancelSubscription({ canManage: false, subscriptionStatus: "active" }), false);
  });
});
