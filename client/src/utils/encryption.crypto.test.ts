import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ARGON2ID_PARAM_TAG_V2,
  ARGON2ID_TIME_COST_V2,
  decryptNote,
  deriveAesKeyFromPassword,
  deriveNoteRootKeys,
  deriveReceiptAckTokenHex,
  encryptNote,
  generateRootKeyBytes,
  hashReceiptAckTokenHex,
  unwrapRootKeyWithPassword,
  wrapRootKeyWithPassword,
} from "./encryption.ts";

(globalThis as unknown as { window: typeof globalThis }).window = globalThis;

const binding = {
  noteId: "00000000-0000-4000-8000-000000033333",
  expirySeconds: 86400,
  maxReads: 1,
};

describe("root-key note cryptography", () => {
  it("encrypts and decrypts note text and rejects AAD tampering", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { noteTextKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);

    const encrypted = await encryptNote("the launch code is 1234", noteTextKey, binding);
    const plaintext = await decryptNote(
      new Uint8Array(encrypted.encryptedData),
      noteTextKey,
      encrypted.iv,
      encrypted.aadBytes,
    );
    assert.equal(plaintext, "the launch code is 1234");

    const tamperedAad = new Uint8Array(encrypted.aadBytes);
    tamperedAad[tamperedAad.length - 1] ^= 1;
    await assert.rejects(
      () =>
        decryptNote(
          new Uint8Array(encrypted.encryptedData),
          noteTextKey,
          encrypted.iv,
          tamperedAad,
        ),
      /Failed to decrypt note/,
    );
  });

  it("derives stable separated subkeys from the same root", async () => {
    const rootKeyBytes = new Uint8Array(32);
    rootKeyBytes.fill(7);

    const first = await deriveNoteRootKeys(rootKeyBytes);
    const second = await deriveNoteRootKeys(rootKeyBytes);
    const encrypted = await encryptNote("same root, same derived text key", first.noteTextKey, binding);

    assert.equal(
      await decryptNote(
        new Uint8Array(encrypted.encryptedData),
        second.noteTextKey,
        encrypted.iv,
        encrypted.aadBytes,
      ),
      "same root, same derived text key",
    );

    await assert.rejects(
      () =>
        decryptNote(
          new Uint8Array(encrypted.encryptedData),
          first.fileWrapKey,
          encrypted.iv,
          encrypted.aadBytes,
        ),
      /Failed to decrypt note/,
    );

    await assert.rejects(
      () =>
        decryptNote(
          new Uint8Array(encrypted.encryptedData),
          first.metadataKey,
          encrypted.iv,
          encrypted.aadBytes,
        ),
      /Failed to decrypt note/,
    );
  });

  it("wraps and unwraps the root key with a password-derived key", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { noteTextKey } = await deriveNoteRootKeys(rootKeyBytes);
    const encrypted = await encryptNote("password-protected text", noteTextKey, binding);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordKey = await deriveAesKeyFromPassword(
      "correct horse battery staple",
      salt,
      ARGON2ID_TIME_COST_V2,
      ARGON2ID_PARAM_TAG_V2,
    );
    const wrapped = await wrapRootKeyWithPassword(rootKeyBytes, passwordKey, encrypted.aadBytes);
    rootKeyBytes.fill(0);

    const unwrapped = await unwrapRootKeyWithPassword(
      wrapped.encryptedRootKey,
      wrapped.encryptedRootKeyIv,
      salt,
      "correct horse battery staple",
      encrypted.aadBytes,
    );
    assert.equal(
      await decryptNote(
        new Uint8Array(encrypted.encryptedData),
        unwrapped.noteTextKey,
        encrypted.iv,
        encrypted.aadBytes,
      ),
      "password-protected text",
    );

    await assert.rejects(
      () =>
        unwrapRootKeyWithPassword(
          wrapped.encryptedRootKey,
          wrapped.encryptedRootKeyIv,
          salt,
          "wrong password",
          encrypted.aadBytes,
        ),
      /operation failed|decrypt/i,
    );
  });

  it("derives a stable receipt-ack token from the root key (pn-ack-v1)", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const tokenA = await deriveReceiptAckTokenHex(rootKeyBytes);
    const tokenB = await deriveReceiptAckTokenHex(rootKeyBytes);
    assert.equal(tokenA, tokenB);
    assert.match(tokenA, /^[0-9a-f]{64}$/);
    const hash = await hashReceiptAckTokenHex(tokenA);
    assert.match(hash, /^[0-9a-f]{64}$/);
    assert.notEqual(hash, tokenA);
    rootKeyBytes.fill(0);
  });
});
