/** Current KDF policy: v2 Argon2id (must match password-encrypt path in the client). */
export const KDF_VERSION_2 = 2;
export const ARGON2ID_TIME_COST_V2 = 3;
export const ARGON2ID_MEMORY_KIB_V2 = 65_536;
export const ARGON2ID_PARALLELISM_V2 = 1;
export const ARGON2ID_HASH_LEN = 32;
export const ARGON2ID_PARAM_TAG_V2 = "argon2id-m65536-p1";

export interface KdfParamsV2 {
  version: typeof KDF_VERSION_2;
  algorithm: "argon2id";
  timeCost: typeof ARGON2ID_TIME_COST_V2;
  memoryKiB: typeof ARGON2ID_MEMORY_KIB_V2;
  parallelism: typeof ARGON2ID_PARALLELISM_V2;
  hashLength: typeof ARGON2ID_HASH_LEN;
  profile: typeof ARGON2ID_PARAM_TAG_V2;
}

const KDF_PARAMS_V2_KEYS = [
  "version",
  "algorithm",
  "timeCost",
  "memoryKiB",
  "parallelism",
  "hashLength",
  "profile",
] as const satisfies readonly (keyof KdfParamsV2)[];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseExactInteger(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return undefined;
  }
  return value;
}

export type ParseKdfParamsV2ObjectResult =
  | { ok: true; params: KdfParamsV2 }
  | { ok: false; message: string };

/**
 * Validates structured KDF metadata for stored password-protected notes (v2 profile only).
 * Rejects unknown keys so stored payloads stay normalized for migrations and debugging.
 */
export function tryParseKdfParamsV2Object(value: unknown): ParseKdfParamsV2ObjectResult {
  if (!isPlainObject(value)) {
    return { ok: false, message: "kdfParams must be a plain object" };
  }

  const allowed = new Set<string>(KDF_PARAMS_V2_KEYS);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      return { ok: false, message: `kdfParams has unsupported field: ${key}` };
    }
  }

  const version = parseExactInteger(value.version);
  const timeCost = parseExactInteger(value.timeCost);
  const memoryKiB = parseExactInteger(value.memoryKiB);
  const parallelism = parseExactInteger(value.parallelism);
  const hashLength = parseExactInteger(value.hashLength);
  const algorithm = value.algorithm;
  const profile = value.profile;

  if (
    version !== KDF_VERSION_2 ||
    algorithm !== "argon2id" ||
    timeCost !== ARGON2ID_TIME_COST_V2 ||
    memoryKiB !== ARGON2ID_MEMORY_KIB_V2 ||
    parallelism !== ARGON2ID_PARALLELISM_V2 ||
    hashLength !== ARGON2ID_HASH_LEN ||
    profile !== ARGON2ID_PARAM_TAG_V2
  ) {
    return {
      ok: false,
      message:
        "kdfParams must match the supported Argon2id profile (version 2, timeCost 3, memoryKiB 65536, parallelism 1, hashLength 32)",
    };
  }

  return {
    ok: true,
    params: {
      version: KDF_VERSION_2,
      algorithm: "argon2id",
      timeCost: ARGON2ID_TIME_COST_V2,
      memoryKiB: ARGON2ID_MEMORY_KIB_V2,
      parallelism: ARGON2ID_PARALLELISM_V2,
      hashLength: ARGON2ID_HASH_LEN,
      profile: ARGON2ID_PARAM_TAG_V2,
    },
  };
}

/**
 * `undefined` input is valid (caller chooses legacy vs required). Present but invalid throws
 * (decrypt path; message matches client expectations).
 */
export function parseKdfParamsV2(value: unknown): KdfParamsV2 | undefined {
  if (value === undefined) {
    return undefined;
  }
  const parsed = tryParseKdfParamsV2Object(value);
  if (!parsed.ok) {
    throw new Error("Invalid KDF parameters for version 2");
  }
  return parsed.params;
}
