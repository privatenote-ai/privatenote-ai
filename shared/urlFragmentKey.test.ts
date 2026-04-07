import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOTE_URL_FRAGMENT_KEY_MIN_CHARS,
  RAW_AES_URL_FRAGMENT_KEY_BYTE_LENGTH,
  decodeBase64UrlToBytes,
  isLikelyTruncatedNoteUrlFragmentKey,
  isValidRawAesKeyUrlFragment,
  normalizeUrlFragmentKey,
  tryDecodeRawAesKeyUrlFragment,
} from "./urlFragmentKey";

describe("normalizeUrlFragmentKey", () => {
  it("applies base64url-style transforms", () => {
    assert.equal(normalizeUrlFragmentKey("ab+/cd=="), "ab-_cd");
    assert.equal(normalizeUrlFragmentKey("nochange"), "nochange");
  });
});

describe("tryDecodeRawAesKeyUrlFragment", () => {
  it("round-trips 32 zero bytes as unpadded base64url", () => {
    const raw = new Uint8Array(RAW_AES_URL_FRAGMENT_KEY_BYTE_LENGTH);
    const b64 = normalizeUrlFragmentKey(Buffer.from(raw).toString("base64"));
    const out = tryDecodeRawAesKeyUrlFragment(b64);
    assert.ok(out);
    assert.equal(out!.length, RAW_AES_URL_FRAGMENT_KEY_BYTE_LENGTH);
    assert.deepEqual(out, raw);
    assert.equal(isValidRawAesKeyUrlFragment(b64), true);
  });

  it("null for wrong byte length", () => {
    assert.equal(tryDecodeRawAesKeyUrlFragment("AAAA"), null);
    assert.equal(isValidRawAesKeyUrlFragment("AAAA"), false);
  });

  it("null for invalid base64", () => {
    assert.equal(tryDecodeRawAesKeyUrlFragment("!!!"), null);
  });
});

describe("decodeBase64UrlToBytes", () => {
  it("decodes padded and unpadded url-safe forms", () => {
    const fromStd = decodeBase64UrlToBytes("AA==");
    assert.ok(fromStd);
    assert.equal(fromStd!.length, 1);
    assert.equal(fromStd![0], 0);
  });
});

describe("isLikelyTruncatedNoteUrlFragmentKey", () => {
  it("false for empty", () => {
    assert.equal(isLikelyTruncatedNoteUrlFragmentKey(""), false);
    assert.equal(isLikelyTruncatedNoteUrlFragmentKey("   "), false);
  });

  it("true when shorter than minimum", () => {
    assert.equal(isLikelyTruncatedNoteUrlFragmentKey("x".repeat(42)), true);
  });

  it("false at minimum length", () => {
    assert.equal(isLikelyTruncatedNoteUrlFragmentKey("x".repeat(NOTE_URL_FRAGMENT_KEY_MIN_CHARS)), false);
  });
});
