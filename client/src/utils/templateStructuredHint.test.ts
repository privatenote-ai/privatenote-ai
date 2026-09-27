import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSmallTierStructuredFieldsHint } from "./templateStructuredHint";

describe("buildSmallTierStructuredFieldsHint", () => {
  it("delegates meeting-request to meeting hint format", () => {
    const h = buildSmallTierStructuredFieldsHint(
      "meeting-request",
      "email Prof. Chen to discuss the Q3 roadmap",
      "improve",
    );
    assert.ok(h.includes("Best-effort cues"));
    assert.ok(h.includes("Prof. Chen"));
  });

  it("parses thank-you note to … for …", () => {
    const h = buildSmallTierStructuredFieldsHint(
      "thank-you",
      "Write a thank you note to a teammate for staying late to fix the build",
      "improve",
    );
    assert.ok(h.includes("Parsed cues"));
    assert.ok(h.includes("a teammate"));
    assert.ok(h.includes("staying late"));
  });

  it("parses apologize to … for …", () => {
    const h = buildSmallTierStructuredFieldsHint(
      "apology",
      "Apologize to my client for missing Friday’s check-in call",
      "improve",
    );
    assert.ok(h.includes("my client"));
    assert.ok(h.includes("missing Friday"));
  });

  it("returns empty for summarize", () => {
    assert.equal(
      buildSmallTierStructuredFieldsHint("thank-you", "thank Pat for help", "summarize"),
      "",
    );
  });
});
