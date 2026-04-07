import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ARGON2ID_HASH_LEN,
  ARGON2ID_MEMORY_KIB_V2,
  ARGON2ID_PARAM_TAG_V2,
  ARGON2ID_PARALLELISM_V2,
  ARGON2ID_TIME_COST_V2,
  KDF_VERSION_2,
  parseKdfParamsV2,
  tryParseKdfParamsV2Object,
} from "./kdfParamsV2";

const valid = {
  version: KDF_VERSION_2,
  algorithm: "argon2id",
  timeCost: ARGON2ID_TIME_COST_V2,
  memoryKiB: ARGON2ID_MEMORY_KIB_V2,
  parallelism: ARGON2ID_PARALLELISM_V2,
  hashLength: ARGON2ID_HASH_LEN,
  profile: ARGON2ID_PARAM_TAG_V2,
};

describe("kdfParamsV2", () => {
  it("tryParseKdfParamsV2Object accepts canonical v2 profile", () => {
    const r = tryParseKdfParamsV2Object(valid);
    assert.equal(r.ok, true);
    if (r.ok) assert.deepEqual(r.params, valid);
  });

  it("rejects wrong timeCost", () => {
    const r = tryParseKdfParamsV2Object({ ...valid, timeCost: 4 });
    assert.equal(r.ok, false);
  });

  it("rejects extra keys", () => {
    const r = tryParseKdfParamsV2Object({ ...valid, extra: 1 });
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.message.includes("unsupported field"));
  });

  it("rejects arrays", () => {
    const r = tryParseKdfParamsV2Object([]);
    assert.equal(r.ok, false);
  });

  it("parseKdfParamsV2 returns undefined for undefined", () => {
    assert.equal(parseKdfParamsV2(undefined), undefined);
  });

  it("parseKdfParamsV2 throws on invalid present value", () => {
    assert.throws(() => parseKdfParamsV2({}), /Invalid KDF parameters/);
  });
});
