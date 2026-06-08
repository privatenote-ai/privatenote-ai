import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ARGON2ID_HASH_LEN,
  ARGON2ID_MEMORY_KIB_V2,
  ARGON2ID_PARAM_TAG_V2,
  ARGON2ID_PARALLELISM_V2,
  ARGON2ID_TIME_COST_V2,
  KDF_VERSION_2,
} from "./kdfParamsV2.ts";
import { NOTE_AES_GCM_IV_BYTE_LENGTH, NOTE_KDF_SALT_MIN_BYTES } from "./noteCryptoWire.ts";
import { MAX_NOTE_CIPHERTEXT_BASE64_CHARS } from "./noteSizeLimits.ts";
import {
  parseStoredNoteCiphertextForReveal,
  STORED_NOTE_CIPHER_ALG,
  STORED_NOTE_PAYLOAD_VERSION,
} from "./storedNotePayload.ts";

const twelveZeroB64 = btoa(String.fromCharCode(...new Uint8Array(NOTE_AES_GCM_IV_BYTE_LENGTH)));
const sixteenZeroB64 = btoa(String.fromCharCode(...new Uint8Array(NOTE_KDF_SALT_MIN_BYTES)));

const validKdfParams = {
  version: KDF_VERSION_2,
  algorithm: "argon2id",
  timeCost: ARGON2ID_TIME_COST_V2,
  memoryKiB: ARGON2ID_MEMORY_KIB_V2,
  parallelism: ARGON2ID_PARALLELISM_V2,
  hashLength: ARGON2ID_HASH_LEN,
  profile: ARGON2ID_PARAM_TAG_V2,
};

function basePayload(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    v: STORED_NOTE_PAYLOAD_VERSION,
    alg: STORED_NOTE_CIPHER_ALG,
    content: btoa("x"),
    iv: twelveZeroB64,
    aad: "eyJleHAiOjEsImlkIjoibiIsInJlYWRzIjoxfQ",
    isPasswordProtected: false,
    ...over,
  };
}

describe("parseStoredNoteCiphertextForReveal", () => {
  it("accepts minimal non-password v1 AES-GCM payload", () => {
    const raw = JSON.stringify(basePayload());
    const p = parseStoredNoteCiphertextForReveal(raw);
    assert.ok(p);
    assert.equal(p!.isPasswordProtected, false);
    assert.equal(p!.salt, null);
    assert.equal(p!.kdfParams, undefined);
  });

  it("accepts password-protected payload with v2 kdfParams", () => {
    const raw = JSON.stringify(
      basePayload({
        isPasswordProtected: true,
        kdfParams: validKdfParams,
        salt: sixteenZeroB64,
        encryptedKeyIv: twelveZeroB64,
        encryptedKey: btoa("ek"),
      }),
    );
    const p = parseStoredNoteCiphertextForReveal(raw);
    assert.ok(p);
    assert.equal(p!.isPasswordProtected, true);
    assert.deepEqual(p!.kdfParams, validKdfParams);
  });

  it("accepts hkdf-root-v2 password payload without stored encryptedKey", () => {
    const raw = JSON.stringify(
      basePayload({
        isPasswordProtected: true,
        keyDerivation: "hkdf-root-v2",
        kdfParams: validKdfParams,
        salt: sixteenZeroB64,
        encryptedKeyIv: twelveZeroB64,
      }),
    );
    const p = parseStoredNoteCiphertextForReveal(raw);
    assert.ok(p);
    assert.equal(p!.keyDerivation, "hkdf-root-v2");
    assert.equal(p!.encryptedKey, null);
  });

  it("accepts libsodium secretstream chunked attachment metadata", () => {
    const raw = JSON.stringify(
      basePayload({
        attachment: {
          v: 2,
          alg: "libsodium-secretstream-xchacha20poly1305",
          name: "photo.jpg",
          type: "image/jpeg",
          size: 8_000_000,
          encryptedSize: 8_000_034,
          chunkSize: 4 * 1024 * 1024,
          totalChunks: 2,
          header: btoa("secretstream-header"),
          aad: btoa("stream-aad"),
          wrappedKey: {
            alg: "AES-GCM",
            iv: twelveZeroB64,
            aad: btoa("wrap-aad"),
            encryptedKey: btoa("wrapped-file-key"),
          },
          chunks: [
            { index: 0, encryptedSize: 4_194_321 },
            { index: 1, encryptedSize: 3_805_713 },
          ],
        },
      }),
    );
    const p = parseStoredNoteCiphertextForReveal(raw);
    assert.ok(p);
    assert.equal(p!.attachment?.v, 2);
    assert.equal(p!.attachment?.encryptedSize, 8_000_034);
  });

  it("rejects invalid JSON", () => {
    assert.equal(parseStoredNoteCiphertextForReveal("not-json"), null);
  });

  it("rejects non-object root", () => {
    assert.equal(parseStoredNoteCiphertextForReveal("[]"), null);
    assert.equal(parseStoredNoteCiphertextForReveal("null"), null);
  });

  it("rejects wrong stored version (migration / old rows)", () => {
    const raw = JSON.stringify(basePayload({ v: 0 }));
    assert.equal(parseStoredNoteCiphertextForReveal(raw), null);
  });

  it("rejects wrong algorithm string", () => {
    const raw = JSON.stringify(basePayload({ alg: "ChaCha20-Poly1305" }));
    assert.equal(parseStoredNoteCiphertextForReveal(raw), null);
  });

  it("rejects missing or blank aad", () => {
    assert.equal(parseStoredNoteCiphertextForReveal(JSON.stringify(basePayload({ aad: "" }))), null);
    assert.equal(parseStoredNoteCiphertextForReveal(JSON.stringify(basePayload({ aad: "   " }))), null);
  });

  it("rejects non-boolean isPasswordProtected", () => {
    assert.equal(parseStoredNoteCiphertextForReveal(JSON.stringify(basePayload({ isPasswordProtected: "yes" }))), null);
  });

  it("rejects non-password row with password wire fields (strict shape)", () => {
    assert.equal(
      parseStoredNoteCiphertextForReveal(JSON.stringify(basePayload({ salt: sixteenZeroB64 }))),
      null,
    );
    assert.equal(
      parseStoredNoteCiphertextForReveal(JSON.stringify(basePayload({ kdfParams: validKdfParams }))),
      null,
    );
  });

  it("rejects ciphertext wire violations", () => {
    const tooLong = "a".repeat(MAX_NOTE_CIPHERTEXT_BASE64_CHARS + 1);
    assert.equal(
      parseStoredNoteCiphertextForReveal(JSON.stringify(basePayload({ content: tooLong }))),
      null,
    );
  });

  it("rejects password payload with bad kdfParams", () => {
    const raw = JSON.stringify(
      basePayload({
        isPasswordProtected: true,
        kdfParams: { ...validKdfParams, timeCost: 999 },
        salt: sixteenZeroB64,
        encryptedKeyIv: twelveZeroB64,
        encryptedKey: btoa("ek"),
      }),
    );
    assert.equal(parseStoredNoteCiphertextForReveal(raw), null);
  });
});
