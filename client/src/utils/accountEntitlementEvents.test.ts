import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isEntitlementRejectionResponse } from "./accountEntitlementEvents";

describe("account entitlement rejection detection", () => {
  it("detects paid capability rejections", () => {
    for (const error of [
      "premium_required",
      "business_plan_required",
      "notifications_not_available",
    ]) {
      assert.equal(
        isEntitlementRejectionResponse(403, JSON.stringify({ error })),
        true,
      );
    }
  });

  it("ignores unrelated and malformed errors", () => {
    assert.equal(
      isEntitlementRejectionResponse(403, JSON.stringify({ error: "unauthorized" })),
      false,
    );
    assert.equal(
      isEntitlementRejectionResponse(429, JSON.stringify({ error: "premium_required" })),
      false,
    );
    assert.equal(isEntitlementRejectionResponse(403, "not-json"), false);
  });
});
