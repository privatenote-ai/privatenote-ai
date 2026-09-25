/**
 * Password wrap matching the website: Argon2id v2 → AES-GCM wrap of the root key.
 * The wrapped blob goes in the URL fragment; salt / wrap IV / kdfParams go to the API.
 */

import { argon2idAsync } from "@noble/hashes/argon2.js";
import {
  ARGON2ID_HASH_LEN,
  ARGON2ID_MEMORY_KIB_V2,
  ARGON2ID_PARALLELISM_V2,
  ARGON2ID_PARAM_TAG_V2,
  ARGON2ID_TIME_COST_V2,
  currentKdfParamsV2,
  type KdfParamsV2,
} from "@shared/kdfParamsV2";
import { arrayBufferToBase64 } from "@shared/noteCrypto";
import { normalizeUrlFragmentKey } from "@shared/urlFragmentKey";

function asBuffer(input: Uint8Array | ArrayBuffer): ArrayBuffer {
  return input instanceof Uint8Array
    ? (input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength) as ArrayBuffer)
    : input;
}

async function deriveAesKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const hashBytes = await argon2idAsync(password, salt, {
    t: ARGON2ID_TIME_COST_V2,
    m: ARGON2ID_MEMORY_KIB_V2,
    p: ARGON2ID_PARALLELISM_V2,
    dkLen: ARGON2ID_HASH_LEN,
  });
  if (hashBytes.byteLength !== ARGON2ID_HASH_LEN) {
    throw new Error("Invalid Argon2 output length");
  }
  try {
    return await globalThis.crypto.subtle.importKey(
      "raw",
      asBuffer(hashBytes),
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  } finally {
    hashBytes.fill(0);
  }
}

export async function wrapRootKeyWithPasswordNote(options: {
  rootKeyBytes: Uint8Array;
  password: string;
  aadBytes: Uint8Array;
}): Promise<{
  saltBase64: string;
  encryptedKeyIvBase64: string;
  fragmentKey: string;
  kdfParams: KdfParamsV2;
}> {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const passwordKey = await deriveAesKeyFromPassword(options.password, salt);
  const encryptedRootKeyIv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const encryptedRootKey = await globalThis.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: asBuffer(encryptedRootKeyIv),
      additionalData: asBuffer(options.aadBytes),
      tagLength: 128,
    },
    passwordKey,
    asBuffer(options.rootKeyBytes),
  );
  return {
    saltBase64: arrayBufferToBase64(salt),
    encryptedKeyIvBase64: arrayBufferToBase64(encryptedRootKeyIv),
    fragmentKey: normalizeUrlFragmentKey(arrayBufferToBase64(encryptedRootKey)),
    kdfParams: currentKdfParamsV2(),
  };
}

export { ARGON2ID_PARAM_TAG_V2 };
