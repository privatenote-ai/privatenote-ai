import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bytesToHex,
  hashReceiptAckTokenHex,
  hexToBytes,
  isValidReceiptAckTokenHash,
  isValidReceiptAckTokenHex,
  NOTE_RECEIPT_ACK_HKDF_INFO,
  timingSafeEqualHex,
} from "./noteReceiptAck.ts";

describe("noteReceiptAck", () => {
  it("exports the fixed HKDF info label", () => {
    assert.equal(NOTE_RECEIPT_ACK_HKDF_INFO, "pn-ack-v1");
  });

  it("validates 64-char lowercase hex", () => {
    const ok = "a".repeat(64);
    assert.equal(isValidReceiptAckTokenHex(ok), true);
    assert.equal(isValidReceiptAckTokenHash(ok), true);
    assert.equal(isValidReceiptAckTokenHex("A".repeat(64)), false);
    assert.equal(isValidReceiptAckTokenHex("short"), false);
  });

  it("round-trips hex and hashes stably", async () => {
    const token = "ab".repeat(32);
    const hash = await hashReceiptAckTokenHex(token);
    assert.equal(isValidReceiptAckTokenHash(hash), true);
    assert.equal(await hashReceiptAckTokenHex(token), hash);
    assert.deepEqual(hexToBytes(token), Uint8Array.from({ length: 32 }, (_, i) => 0xab));
    assert.equal(bytesToHex(hexToBytes(token)), token);
  });

  it("compares hex in constant-ish fashion", () => {
    assert.equal(timingSafeEqualHex("aa", "aa"), true);
    assert.equal(timingSafeEqualHex("aa", "ab"), false);
    assert.equal(timingSafeEqualHex("aa", "aaa"), false);
  });
});
