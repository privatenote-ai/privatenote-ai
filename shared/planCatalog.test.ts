import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hostedAiMonthlyLimit, normalizeAccountType, planDefinitionFor } from "./planCatalog";

describe("planCatalog", () => {
  it("normalizes legacy plan ids", () => {
    assert.equal(normalizeAccountType("pro"), "personal_premium");
    assert.equal(normalizeAccountType("business"), "business_premium");
    assert.equal(normalizeAccountType(undefined), "free");
  });

  it("sets monthly hosted AI limits", () => {
    assert.equal(hostedAiMonthlyLimit("free"), 3);
    assert.equal(hostedAiMonthlyLimit("personal_premium"), 100);
    assert.equal(hostedAiMonthlyLimit("business_premium"), 500);
  });

  it("enables premium delivery features on paid tiers", () => {
    assert.equal(planDefinitionFor("free").features.proofOfAccess, false);
    assert.equal(planDefinitionFor("personal_premium").features.proofOfAccess, true);
  });
});
