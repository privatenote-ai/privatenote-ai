import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BUSINESS_RECEIPT_ACK_PRESETS,
  normalizeReceiptAckStatement,
  receiptAckStatementId,
} from "./receiptAcknowledgment.ts";

describe("Business receipt acknowledgment", () => {
  it("normalizes a short non-secret confirmation statement", () => {
    assert.equal(normalizeReceiptAckStatement("  I confirm   receipt. "), "I confirm receipt.");
    assert.equal(normalizeReceiptAckStatement(""), null);
    assert.equal(normalizeReceiptAckStatement("x".repeat(181)), null);
  });

  it("uses stable identifiers for presets and custom text", () => {
    assert.equal(receiptAckStatementId(BUSINESS_RECEIPT_ACK_PRESETS[0].label), "received");
    assert.equal(receiptAckStatementId("I acknowledge the handover."), "custom");
  });
});
