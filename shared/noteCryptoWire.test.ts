import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MAX_NOTE_CIPHERTEXT_BASE64_CHARS } from "./noteSizeLimits.ts";
import {
  NOTE_AES_GCM_IV_BYTE_LENGTH,
  NOTE_KDF_SALT_MIN_BYTES,
  passwordWireFieldsPresent,
  validateNoteAesGcmIvWire,
  validateNoteCiphertextWire,
  validateNoteEncryptedKeyWire,
  validateNoteKdfSaltWire,
} from "./noteCryptoWire.ts";

const twelveZeroB64 = btoa(String.fromCharCode(...new Uint8Array(NOTE_AES_GCM_IV_BYTE_LENGTH)));
const sixteenZeroB64 = btoa(String.fromCharCode(...new Uint8Array(NOTE_KDF_SALT_MIN_BYTES)));

describe("validateNoteAesGcmIvWire", () => {
  it("accepts standard base64 12-byte IV", () => {
    assert.equal(validateNoteAesGcmIvWire(twelveZeroB64, "iv").ok, true);
  });

  it("accepts base64url", () => {
    const urlish = twelveZeroB64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    assert.equal(validateNoteAesGcmIvWire(urlish, "iv").ok, true);
  });

  it("rejects wrong length", () => {
    const r = validateNoteAesGcmIvWire(btoa("short"), "iv");
    assert.equal(r.ok, false);
    assert.ok(r.ok === false && r.message.includes("12"));
  });

  it("rejects invalid base64", () => {
    const r = validateNoteAesGcmIvWire("!!!", "encryptedKeyIv");
    assert.equal(r.ok, false);
    assert.ok(r.ok === false && r.message.includes("encryptedKeyIv"));
  });
});

describe("validateNoteKdfSaltWire", () => {
  it("accepts 16-byte salt", () => {
    assert.equal(validateNoteKdfSaltWire(sixteenZeroB64).ok, true);
  });

  it("rejects salt shorter than 16 bytes", () => {
    const r = validateNoteKdfSaltWire(btoa(String.fromCharCode(...new Uint8Array(15))));
    assert.equal(r.ok, false);
    assert.ok(r.ok === false && r.message.includes("16"));
  });
});

describe("validateNoteCiphertextWire", () => {
  it("accepts non-empty base64 payload", () => {
    assert.equal(validateNoteCiphertextWire(btoa("plaintext")).ok, true);
  });

  it("rejects invalid base64", () => {
    const r = validateNoteCiphertextWire("!!!", "content");
    assert.equal(r.ok, false);
    assert.ok(r.ok === false && r.message.includes("base64"));
  });

  it("returns too_large kind when over cap", () => {
    const r = validateNoteCiphertextWire("a".repeat(MAX_NOTE_CIPHERTEXT_BASE64_CHARS + 1));
    assert.equal(r.ok, false);
    assert.ok(r.ok === false && r.kind === "too_large");
  });
});

describe("validateNoteEncryptedKeyWire", () => {
  it("accepts non-empty ciphertext blob", () => {
    assert.equal(validateNoteEncryptedKeyWire(btoa("x")).ok, true);
  });

  it("rejects empty after trim", () => {
    const r = validateNoteEncryptedKeyWire("  ");
    assert.equal(r.ok, false);
  });
});

describe("passwordWireFieldsPresent", () => {
  it("is false for empty password fields", () => {
    assert.equal(passwordWireFieldsPresent({ salt: "", encryptedKey: null }), false);
  });

  it("is true when any field non-empty", () => {
    assert.equal(passwordWireFieldsPresent({ encryptedKeyIv: "ab" }), true);
  });
});
