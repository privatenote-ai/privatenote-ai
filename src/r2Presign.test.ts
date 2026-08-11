import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NOTE_FILE_DIRECT_R2_MIN_BYTES } from "../shared/noteFileLimits.ts";
import { readR2PresignConfig } from "./r2Presign.ts";
import type { Env } from "./types.ts";

describe("R2 presign config", () => {
  it("returns null when any required field is missing", () => {
    assert.equal(readR2PresignConfig({} as Env), null);
    assert.equal(
      readR2PresignConfig({
        R2_ACCESS_KEY_ID: "ak",
        R2_SECRET_ACCESS_KEY: "sk",
        R2_ACCOUNT_ID: "acct",
      } as Env),
      null,
    );
  });

  it("returns config when all fields are present", () => {
    const config = readR2PresignConfig({
      R2_ACCESS_KEY_ID: " ak ",
      R2_SECRET_ACCESS_KEY: " sk ",
      R2_ACCOUNT_ID: " acct ",
      R2_BUCKET_NAME: " privatenote-files-staging-eu ",
    } as Env);
    assert.deepEqual(config, {
      accessKeyId: "ak",
      secretAccessKey: "sk",
      accountId: "acct",
      bucketName: "privatenote-files-staging-eu",
    });
  });
});

describe("direct R2 threshold", () => {
  it("is below Cloudflare Free/Pro CDN body limit (100 MB)", () => {
    assert.ok(NOTE_FILE_DIRECT_R2_MIN_BYTES < 100 * 1024 * 1024);
    assert.ok(NOTE_FILE_DIRECT_R2_MIN_BYTES >= 80 * 1024 * 1024);
  });
});
