/**
 * Validate input, reserve an ID, encrypt locally, POST ciphertext.
 * Plaintext never leaves this process. The decryption key is returned only
 * inside the URL fragment.
 */

import {
  ARGON2ID_PARAM_TAG_V2,
  ARGON2ID_TIME_COST_V2,
  arrayBufferToBase64,
  currentKdfParamsV2,
  deriveAesKeyFromPassword,
  deriveNoteRootKeys,
  encryptNote as encryptNoteWithRootKey,
  generateRootKeyBytes,
  generateSalt,
  NOTE_KEY_DERIVATION_HKDF_ROOT_V2,
  serializeEncryptedPayload,
  wrapRootKeyWithPassword,
} from "../../../client/src/utils/encryption.ts";
import {
  generateContentKey,
  encryptNote,
  serializeEncryptedPayload as serializeStandardPayload,
} from "@shared/noteCrypto";
import { noteExpiryPresetIdToSeconds } from "@shared/noteExpiry";
import { MAX_NOTE_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import { normalizeUrlFragmentKey } from "@shared/urlFragmentKey";
import { reserveNoteId, createNote as apiCreateNote } from "./apiClient.ts";
import {
  PRIVATENOTE_API_BASE_URL,
  PRIVATENOTE_WEB_ORIGIN,
  type ExpiresIn,
} from "./settings.ts";

const EXPIRY_MAP: Record<ExpiresIn, string> = {
  "15m": "15m",
  "1h": "1h",
  "24h": "1d",
  "7d": "7d",
};

const VALID_EXPIRES: ReadonlySet<string> = new Set<ExpiresIn>(["15m", "1h", "24h", "7d"]);

export function isExpiresIn(value: string): value is ExpiresIn {
  return VALID_EXPIRES.has(value);
}

export function expiresInToSeconds(expiresIn: ExpiresIn): number {
  return noteExpiryPresetIdToSeconds(EXPIRY_MAP[expiresIn]);
}

export interface CreatePrivateNoteInput {
  content: string;
  expiresIn?: ExpiresIn;
  burnAfterReading?: boolean;
  title?: string;
  password?: string;
}

export interface CreatePrivateNoteOutput {
  secureUrl: string;
  expiresAt: string;
  burnAfterReading: boolean;
  isPasswordProtected: boolean;
}

function utf8ByteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

export async function createPrivateNote(
  input: CreatePrivateNoteInput,
): Promise<CreatePrivateNoteOutput> {
  const trimmed = input.content.trim();
  if (!trimmed) {
    throw new Error("Content cannot be empty");
  }

  const utf8Length = utf8ByteLength(input.content);
  if (utf8Length > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
    throw new Error(`Content too large (max ${MAX_NOTE_PLAINTEXT_UTF8_BYTES / 1024} KB)`);
  }

  const expiresIn = input.expiresIn ?? "24h";
  if (!isExpiresIn(expiresIn)) {
    throw new Error("Invalid expiresIn — must be 15m, 1h, 24h, or 7d");
  }

  const burnAfterReading = input.burnAfterReading !== false;
  const maxReads = burnAfterReading ? 1 : 2;
  const expirySeconds = expiresInToSeconds(expiresIn);
  const isPasswordProtected = Boolean(input.password?.trim());

  const plaintext = input.title
    ? `${input.title}\n\n${input.content}`
    : input.content;

  const apiBaseUrl = PRIVATENOTE_API_BASE_URL;
  const webOrigin = PRIVATENOTE_WEB_ORIGIN;

  const { id } = await reserveNoteId(apiBaseUrl);
  const aadBinding = { noteId: id, expirySeconds, maxReads };

  let secureUrl: string;
  let apiBody: Parameters<typeof apiCreateNote>[1];

  if (isPasswordProtected) {
    const password = input.password!.trim();
    const { rootKeyBytes } = generateRootKeyBytes();
    const salt = generateSalt();

    try {
      const passwordKey = await deriveAesKeyFromPassword(
        password,
        salt,
        ARGON2ID_TIME_COST_V2,
        ARGON2ID_PARAM_TAG_V2,
      );
      const { noteTextKey } = await deriveNoteRootKeys(rootKeyBytes);
      const { encryptedData, iv, aadBytes } = await encryptNoteWithRootKey(
        plaintext,
        noteTextKey,
        aadBinding,
      );
      const wirePayload = serializeEncryptedPayload({ encryptedData, iv, aadBytes });
      const { encryptedRootKey, encryptedRootKeyIv } = await wrapRootKeyWithPassword(
        rootKeyBytes,
        passwordKey,
        aadBytes,
      );

      const fragmentKey = normalizeUrlFragmentKey(arrayBufferToBase64(encryptedRootKey));
      secureUrl = `${webOrigin}/note/${id}#${fragmentKey}`;

      apiBody = {
        id,
        content: wirePayload.content,
        iv: wirePayload.iv,
        aad: wirePayload.aad,
        expirySeconds,
        maxReads,
        isPasswordProtected: true,
        keyDerivation: NOTE_KEY_DERIVATION_HKDF_ROOT_V2,
        salt: arrayBufferToBase64(salt),
        encryptedKeyIv: arrayBufferToBase64(encryptedRootKeyIv),
        kdfParams: currentKdfParamsV2(),
        _hp: "",
        aiMode: false,
        creationSource: "chrome",
        creationEntryPoint: "extension",
      };
    } finally {
      rootKeyBytes.fill(0);
    }
  } else {
    const { key, exportedKey } = await generateContentKey();
    const { encryptedData, iv, aadBytes } = await encryptNote(plaintext, key, aadBinding);
    const { content, iv: ivBase64, aad } = serializeStandardPayload({
      encryptedData,
      iv,
      aadBytes,
    });

    secureUrl = `${webOrigin}/note/${id}#${exportedKey}`;
    apiBody = {
      id,
      content,
      iv: ivBase64,
      aad,
      expirySeconds,
      maxReads,
      isPasswordProtected: false,
      _hp: "",
      aiMode: false,
      creationSource: "chrome",
      creationEntryPoint: "extension",
    };
  }

  await apiCreateNote(apiBaseUrl, apiBody);

  const expiresAt = new Date(Date.now() + expirySeconds * 1000).toISOString();

  return {
    secureUrl,
    expiresAt,
    burnAfterReading,
    isPasswordProtected,
  };
}
