import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_NOTE_CIPHERTEXT_BASE64_CHARS,
  MAX_NOTE_PLAINTEXT_UTF8_BYTES,
  maxNoteCiphertextBase64CharsForAccount,
  maxNotePlaintextUtf8BytesForAccount,
} from "./noteSizeLimits.ts";

describe("noteSizeLimits", () => {
  it("tiers plaintext by plan", () => {
    assert.equal(maxNotePlaintextUtf8BytesForAccount("free"), 50 * 1024);
    assert.equal(maxNotePlaintextUtf8BytesForAccount("personal_premium"), 200 * 1024);
    assert.equal(maxNotePlaintextUtf8BytesForAccount("business_premium"), 500 * 1024);
    assert.equal(MAX_NOTE_PLAINTEXT_UTF8_BYTES, 50 * 1024);
  });

  it("uses the Business ciphertext cap as the hard wire max", () => {
    assert.equal(
      MAX_NOTE_CIPHERTEXT_BASE64_CHARS,
      maxNoteCiphertextBase64CharsForAccount("business_premium"),
    );
    assert.ok(
      maxNoteCiphertextBase64CharsForAccount("free") <
        maxNoteCiphertextBase64CharsForAccount("personal_premium"),
    );
    assert.ok(
      maxNoteCiphertextBase64CharsForAccount("personal_premium") < MAX_NOTE_CIPHERTEXT_BASE64_CHARS,
    );
  });
});
