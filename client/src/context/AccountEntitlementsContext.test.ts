import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { entitlementRefreshDelayMs } from "@/utils/accountEntitlementRefresh";

describe("entitlement expiry refresh scheduling", () => {
  const now = new Date("2026-07-28T12:00:00.000Z").getTime();

  it("refreshes just after a nearby paid-access deadline", () => {
    assert.equal(
      entitlementRefreshDelayMs("2026-07-28T12:00:10.000Z", now),
      10_250,
    );
  });

  it("rechecks daily when the deadline is farther away", () => {
    assert.equal(
      entitlementRefreshDelayMs("2026-08-28T12:00:00.000Z", now),
      24 * 60 * 60 * 1000,
    );
  });

  it("refreshes immediately for an elapsed deadline", () => {
    assert.equal(
      entitlementRefreshDelayMs("2026-07-28T11:59:59.000Z", now),
      0,
    );
    assert.equal(entitlementRefreshDelayMs(null, now), null);
  });
});
